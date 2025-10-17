import { auth } from "./authClient";
import { getAuthState } from "@/store/authStore";
import { getErrorState } from "@/store/errorStore";

/**
 * Error handler utility for API responses
 * Handles authentication errors, unauthorized access, and other HTTP errors
 */
export const errorHandler = (response: Response): Response => {
  const isLoggedIn = auth.isLoggedIn();

  if (isLoggedIn && response.status === 401) {
    // Unauthorized - clear tokens and logout
    const authState = getAuthState();
    authState.clearAuth();
    auth.msalClient.logout();
  } else if (isLoggedIn && response.status === 403) {
    // Forbidden - set error state
    const errorState = getErrorState();
    errorState.setError("Unauthorised access", "403");
  } else {
    // Clear error state for successful responses or other errors
    const errorState = getErrorState();
    errorState.clearError();
  }

  return response;
};
