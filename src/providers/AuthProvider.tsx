import * as React from "react";
import { useEffect, useCallback } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { AuthProviderState } from "./AuthProvider.types";
import { AccountContext } from "./useAccount";
import type { AccountInfo } from "@azure/msal-browser";
import { authConfig } from "@/config/msalConfig";

type AuthProviderStateType = typeof AuthProviderState[keyof typeof AuthProviderState];

interface AuthProviderProps {
  render: (props: { account?: AccountInfo; state: AuthProviderStateType }) => React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ render }) => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [authState, setAuthState] = React.useState<AuthProviderStateType>(AuthProviderState.Loading);
  const [account, setAccount] = React.useState<AccountInfo | undefined>();

  const performLogin = useCallback(async () => {
    // Wait for any in-progress interactions to complete
    if (inProgress !== InteractionStatus.None) {
      return;
    }

    try {
      // Handle redirect promise first
      const response = await instance.handleRedirectPromise();

      if (response) {
        // User just completed authentication via redirect
        setAccount(response.account);
        setAuthState(AuthProviderState.Success);
        return;
      }

      // Check if user is already logged in
      if (isAuthenticated && accounts.length > 0) {
        const existingAccount = accounts[0];

        // Verify the account has the correct policy
        if (
          existingAccount.homeAccountId.includes(
            authConfig.policies.signin.toLowerCase()
          )
        ) {
          try {
            // Try to get a token silently to verify the session
            await instance.acquireTokenSilent({
              account: existingAccount,
              scopes: authConfig.scopes,
            });
            setAccount(existingAccount);
            setAuthState(AuthProviderState.Success);
            return;
          } catch (err) {
            console.error("Error getting access token:", err);
          }
        } else {
          // Wrong policy, need to re-login
          await instance.logout();
        }
      }

      // No valid session, initiate login
      await instance.loginRedirect({
        scopes: authConfig.scopes,
      });
    } catch (error) {
      console.error("Login failed:", error);
      setAuthState(AuthProviderState.Error);
    }
  }, [instance, accounts, isAuthenticated, inProgress]);

  useEffect(() => {
    performLogin();
  }, [performLogin]);

  // Render based on account state
  return (
    <AccountContext.Provider value={account || null}>
      {render({ account, state: authState })}
    </AccountContext.Provider>
  );
};
