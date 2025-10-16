import { errorHandler } from "./errorhandler";
import queryString from "query-string";
import store from "@/store/store";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { signoutAction } from "@/store/auth/authActions";
import { msalInstance, authConfig, loginRequest } from "@/config/msalConfig";
import { getAuthState } from "@/store/authStore";

class Auth {
  get msalClient() {
    return msalInstance;
  }

  get options() {
    return authConfig;
  }

  get loginScopes() {
    return loginRequest.scopes;
  }

  isLoggedIn() {
    const accounts = this.msalClient.getAllAccounts();
    if (accounts && accounts.length > 0) {
      return true;
    }

    return false;
  }

  loginInProgress = () => {
    return (
      sessionStorage.getItem(
        `msal.${authConfig.clientId}.interaction.status`
      ) == "interaction_in_progress"
    );
  };

  async login() {
    try {
      let tokenResponse = await this.msalClient.handleRedirectPromise();

      const accountObj = tokenResponse
        ? tokenResponse.account
        : this.msalClient.getAllAccounts()[0];

      if (accountObj) {
        if (
          !accountObj.homeAccountId.includes(
            authConfig.policies.signin.toLowerCase()
          )
        ) {
          await this.msalClient.logout();
          await this.msalClient.loginRedirect(loginRequest);
          getAuthState().setAuthenticated(true);
        }
      }

      if (accountObj && tokenResponse) {
        getAuthState().setAuthData({
          isAuthenticated: true,
          accessToken: tokenResponse.accessToken,
          idTokenClaims: tokenResponse.idTokenClaims,
        });
        return { account: accountObj, accessToken: tokenResponse.accessToken };
      } else if (accountObj) {
        try {
          tokenResponse = await this.msalClient.acquireTokenSilent({
            account: this.msalClient.getAllAccounts()[0],
            scopes: authConfig.scopes,
          });
          getAuthState().setAuthenticated(true);
        } catch (err) {
          if (err instanceof InteractionRequiredAuthError) {
            await this.msalClient.acquireTokenRedirect({
              scopes: authConfig.scopes,
            });
            getAuthState().setAuthenticated(true);
          }
        }
      } else {
        if (this.loginInProgress()) {
          return {};
        }

        await this.msalClient.loginRedirect(loginRequest);
        getAuthState().setAuthenticated(true);
      }

      if (tokenResponse) {
        getAuthState().setAuthData({
          isAuthenticated: true,
          accessToken: tokenResponse.accessToken,
          idTokenClaims: tokenResponse.idTokenClaims,
        });
        return { account: accountObj, accessToken: tokenResponse.accessToken };
      }

      return { error: "unknown error" };
    } catch (error: unknown) {
      // Type guard for MSAL errors with errorMessage property
      const err = error as { errorMessage?: string };

      if (err.errorMessage && err.errorMessage.indexOf("AADB2C90091") > -1) {
        // user cancels the flow
        await this.msalClient.logout();
        store.dispatch(signoutAction());
        await this.msalClient.loginRedirect(loginRequest);
        getAuthState().setAuthenticated(true);
      }

      if (err.errorMessage && err.errorMessage.indexOf("AADB2C90118") > -1) {
        try {
          // Password reset policy/authority
          await this.msalClient.loginRedirect({
            scopes: authConfig.scopes,
            authority: authConfig.instance.replace(
              authConfig.policies.signin,
              authConfig.policies.resetpassword
            ),
          });
          getAuthState().setAuthenticated(true);
        } catch (err) {
          console.error("Password reset redirect failed", err);
        }
      }

      return { error: error };
    }
  }

  async getAccessToken(scopes = null) {

    // Check if we already have an access token in store
    const authState = getAuthState();
    if (authState.accessToken) {
      return authState.accessToken;
    }

    try {
      const accounts = this.msalClient.getAllAccounts();
     

      let tokenResponse = await this.msalClient.handleRedirectPromise();
      if (!tokenResponse) {
        try {
          tokenResponse = await this.msalClient.acquireTokenSilent({
            account: accounts[0],
            scopes: scopes ? scopes : authConfig.scopes,
          });
          getAuthState().setAuthenticated(true);
        } catch (error) {

          if (error instanceof InteractionRequiredAuthError) {
           
            await this.msalClient.acquireTokenRedirect({
              account: accounts[0],
              scopes: scopes ? scopes : authConfig.scopes,
            });
            getAuthState().setAuthenticated(true);
          }
        }
      }

      if (tokenResponse) {
        getAuthState().setAuthData({
          isAuthenticated: true,
          accessToken: tokenResponse.accessToken,
          idTokenClaims: tokenResponse.idTokenClaims,
        });
        return tokenResponse.accessToken;
      }
    } catch (error) {
      return { error: error };
    }
  }

  googleLogin(planId: string, token: string) {
    auth.msalClient.loginRedirect({
      scopes: authConfig.scopes,
      authority: authConfig.instance
        .toLowerCase()
        .replace(
          authConfig.policies.signin.toLowerCase(),
          authConfig.policies.newtenant.toLowerCase()
        ),
      extraQueryParameters: {
        domain_hint: "google.com",
        planId: planId,
        token: token,
      },
    });
  }

  azureLogin(planId: string, token: string) {
    auth.msalClient.loginRedirect({
      scopes: authConfig.scopes,
      authority: authConfig.instance
        .toLowerCase()
        .replace(
          authConfig.policies.signin.toLowerCase(),
          authConfig.policies.newtenant.toLowerCase()
        ),
      extraQueryParameters: {
        domain_hint: "commonaad",
        planId: planId,
        token: token,
      },
    });
  }

  googleSignup = (planId: string, token: string) => {
    sessionStorage.clear();
    auth.googleLogin(planId, token);
  };

  azureSignup = (planId: string, token: string) => {
    sessionStorage.clear();
    auth.azureLogin(planId, token);
  };

  logout() {
    getAuthState().clearAuth();
    try {
      store.dispatch(signoutAction());
      fetch(import.meta.env.VITE_API_BASE_URL + "/api/user/logout", {
        method: "POST",
        headers: this.getAuthorizationHeader(),
      })
        .then(errorHandler)
        .then(function () {
          auth.msalClient.logout().then(() => {
            localStorage.clear();
            getAuthState().clearAuth();
          });
        })
        .catch((error) => {
          console.error("Logout failed", error);
        });
    } catch (error) {
      console.error("Logout error", error);
    }
  }

  getMultiPartAuthorizationHeader() {
    const accessToken = getAuthState().accessToken;
    let instanceId: string | undefined;
    if (window.location && window.location.search) {
      const values = queryString.parse(window.location.search);
      instanceId =
        typeof values.instanceid === "string" ? values.instanceid : undefined;
    }

    return new Headers({
      Authorization: `Bearer ${accessToken}`,
      ...(instanceId && { InstanceId: instanceId }),
    });
  }

  getAuthorizationHeader() {
    const accessToken = getAuthState().accessToken;
    let instanceId: string | undefined;
    if (window.location && window.location.search) {
      const values = queryString.parse(window.location.search);
      instanceId =
        typeof values.instanceid === "string" ? values.instanceid : undefined;
    }

    return new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(instanceId && { InstanceId: instanceId }),
    });
  }
  getHeader() {
    const accessToken = getAuthState().accessToken;
    let instanceId: string | undefined;
    if (window.location && window.location.search) {
      const values = queryString.parse(window.location.search);
      instanceId =
        typeof values.instanceid === "string" ? values.instanceid : undefined;
    }

    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(instanceId && { InstanceId: instanceId }),
    };
  }

  getInstanceId() {
    if (window.location && window.location.search) {
      const values = queryString.parse(window.location.search);
      return values.instanceid;
    }
    return "";
  }

  getQueryString() {
    return "?instanceid=" + auth.getInstanceId();
  }

  getHeaderWithToken() {
    const accessToken = getAuthState().accessToken;
    let instanceId: string | undefined;
    if (window.location && window.location.search) {
      const values = queryString.parse(window.location.search);
      instanceId =
        typeof values.instanceid === "string" ? values.instanceid : undefined;
    }
    return new Headers({
      Authorization: `Bearer ${accessToken}`,
      ...(instanceId && { InstanceId: instanceId }),
    });
  }

  currentUser() {
    const accounts = this.msalClient.getAllAccounts();

    if (accounts && accounts.length > 0) {
      const account = accounts[0];

      const idToken = getAuthState().idTokenClaims;
      if (idToken) {
        return {
          name: idToken.name,
          firstName: idToken.given_name,
          lastName: idToken.family_name,
          emails: idToken.email,
          city: idToken.city,
          country: idToken.country,
          jobtitle: idToken.jobtitle,
          isPlatformAdmin: idToken.extension_IsPlatformAdmin,
          isAccountEnabled: idToken.account_Enabled,
          id: idToken.sub,
        };
      }

      return {
        name: account.name,
        id: account.localAccountId,
        isAccountEnabled : account.idTokenClaims ? account.idTokenClaims['account_Enabled'] : undefined
      };
    }

    return undefined;
  }
}
export const auth = new Auth();
