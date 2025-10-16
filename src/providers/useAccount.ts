import { createContext } from "react";
import { useMsal } from "@azure/msal-react";
import type { AccountInfo } from "@azure/msal-browser";

// Create typed context for account (used by AuthProvider)
export const AccountContext = createContext<AccountInfo | null>(null);
AccountContext.displayName = "AccountContext";

/**
 * Hook to access the current authenticated user's account information
 * This hook leverages msal-react's useMsal hook to get the active account
 * @returns AccountInfo | null - The current authenticated account or null
 */
export const useAccount = (): AccountInfo | null => {
  const { accounts } = useMsal();

  // Return the first account if available (most apps have a single account)
  return accounts.length > 0 ? accounts[0] : null;
};
