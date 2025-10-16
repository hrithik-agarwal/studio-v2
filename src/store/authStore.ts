import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface IdTokenClaims {
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  city?: string;
  country?: string;
  jobtitle?: string;
  extension_IsPlatformAdmin?: boolean;
  account_Enabled?: boolean;
  sub?: string;
  [key: string]: any; // Allow additional MSAL claims
}

type AuthState = {
  isAuthenticated: boolean;
  accessToken?: string;
  idTokenClaims?: IdTokenClaims | Record<string, any>;

  // Actions
  setAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (token: string | undefined) => void;
  setIdTokenClaims: (
    claims: IdTokenClaims | Record<string, any> | undefined
  ) => void;
  setAuthData: (data: {
    isAuthenticated: boolean;
    accessToken?: string;
    idTokenClaims?: IdTokenClaims | Record<string, any>;
  }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    immer((set) => ({
      isAuthenticated: false,
      accessToken: undefined,
      idTokenClaims: undefined,

      setAuthenticated: (isAuthenticated: boolean) =>
        set((state) => {
          state.isAuthenticated = isAuthenticated;
        }),

      setAccessToken: (token: string | undefined) =>
        set((state) => {
          state.accessToken = token;
        }),

      setIdTokenClaims: (
        claims: IdTokenClaims | Record<string, any> | undefined
      ) =>
        set((state) => {
          state.idTokenClaims = claims;
        }),

      setAuthData: (data) =>
        set((state) => {
          state.isAuthenticated = data.isAuthenticated;
          state.accessToken = data.accessToken;
          state.idTokenClaims = data.idTokenClaims;
        }),

      clearAuth: () =>
        set((state) => {
          state.isAuthenticated = false;
          state.accessToken = undefined;
          state.idTokenClaims = undefined;
        }),
    })),
    { name: "authStore" }
  )
);

// Helper function to get auth state outside React components
export const getAuthState = () => useAuthStore.getState();
