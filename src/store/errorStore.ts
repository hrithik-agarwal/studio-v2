import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type ErrorState = {
  isError: boolean;
  message: string;
  errorCode: string;

  // Actions
  setError: (message: string, errorCode: string) => void;
  clearError: () => void;
};

export const useErrorStore = create<ErrorState>()(
  devtools(
    immer((set) => ({
      isError: false,
      message: "",
      errorCode: "",

      setError: (message: string, errorCode: string) =>
        set((state) => {
          state.isError = true;
          state.message = message;
          state.errorCode = errorCode;
        }),

      clearError: () =>
        set((state) => {
          state.isError = false;
          state.message = "";
          state.errorCode = "";
        }),
    })),
    { name: "errorStore" }
  )
);

// Helper function to get error state outside React components
export const getErrorState = () => useErrorStore.getState();
