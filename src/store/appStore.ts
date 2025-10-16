import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { auth } from '../clients/authClient'

export interface IUserExistsResponse {
  isSuccessful: boolean
  message: string
}

type AppState = {
  userCheck?: IUserExistsResponse
  isLoading: boolean
  error?: string
  // actions
  loadUserCheck: () => Promise<void>
  clearError: () => void
}

// API call (same logic you had)
async function fetchUserCheck(): Promise<IUserExistsResponse> {
  const user = auth.currentUser()
  if (!user) throw new Error('User not logged-in')

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/user/checkUserExists`, // <-- Vite env
    {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectId: user.id }),
    }
  )
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        userCheck: undefined,
        isLoading: false,
        error: undefined,

        loadUserCheck: async () => {
          set((s) => {
            s.isLoading = true
            s.error = undefined
          })
          try {
            const data = await fetchUserCheck()
            set((s) => {
              s.userCheck = data
              s.isLoading = false
            })
          } catch (e: any) {
            set((s) => {
              s.error = e?.message ?? 'Unknown error'
              s.isLoading = false
            })
          }
        },

        clearError: () => set((s) => { s.error = undefined }),
      })),
      {
        name: 'persistentState', // matches your old localStorage key
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          userCheck: state.userCheck,
        }),
        version: 1,
      }
    ),
    { name: 'appStore' }
  )
)

// Optional helpers
export type StoreState = ReturnType<typeof useAppStore.getState>