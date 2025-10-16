import { errorHandler } from "./errorhandler";
import queryString from "query-string";
import store from "@/store/store";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { signoutAction } from "@/store/auth/authActions";
import { msalInstance, authConfig, loginRequest } from "@/config/msalConfig";
import { getAuthState } from "@/store/authStore";
import { logger } from "@/utils/logger";

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
    logger.info('Login initiated');

    try {
      logger.debug('Handling redirect promise...');
      let tokenResponse = await this.msalClient.handleRedirectPromise();

      const accountObj = tokenResponse
        ? tokenResponse.account
        : this.msalClient.getAllAccounts()[0];

      if (accountObj) {
        logger.debug('Account found', { accountId: accountObj.homeAccountId });

        if (
          !accountObj.homeAccountId.includes(
            authConfig.policies.signin.toLowerCase()
          )
        ) {
          logger.warn('Account policy mismatch, logging out and redirecting');
          await this.msalClient.logout();
          await this.msalClient.loginRedirect(loginRequest);
          getAuthState().setAuthenticated(true);
        }
      }

      if (accountObj && tokenResponse) {
        logger.info('Login successful with token response', {
          hasAccessToken: !!tokenResponse.accessToken,
          accountName: accountObj.name,
        });

        getAuthState().setAuthData({
          isAuthenticated: true,
          accessToken: tokenResponse.accessToken,
          idTokenClaims: tokenResponse.idTokenClaims,
        });
        return { account: accountObj, accessToken: tokenResponse.accessToken };
      } else if (accountObj) {
        logger.debug('Account exists but no token response, acquiring token silently');
        try {
          tokenResponse = await this.msalClient.acquireTokenSilent({
            account: this.msalClient.getAllAccounts()[0],
            scopes: authConfig.scopes,
          });
          logger.info('Token acquired silently');
          getAuthState().setAuthenticated(true);
        } catch (err) {
          logger.warn('Silent token acquisition failed', err);
          if (err instanceof InteractionRequiredAuthError) {
            logger.info('Redirecting for interactive authentication');
            await this.msalClient.acquireTokenRedirect({
              scopes: authConfig.scopes,
            });
            getAuthState().setAuthenticated(true);
          }
        }
      } else {
        if (this.loginInProgress()) {
          logger.debug('Login already in progress');
          return {};
        }

        logger.info('No account found, redirecting to login');
        await this.msalClient.loginRedirect(loginRequest);
        getAuthState().setAuthenticated(true);
      }

      if (tokenResponse) {
        logger.info('Authentication completed successfully');
        getAuthState().setAuthData({
          isAuthenticated: true,
          accessToken: tokenResponse.accessToken,
          idTokenClaims: tokenResponse.idTokenClaims,
        });
        return { account: accountObj, accessToken: tokenResponse.accessToken };
      }

      logger.warn('Login completed without token response');
      return { error: "unknown error" };
    } catch (error: unknown) {
      logger.error('Login error', error);

      // Type guard for MSAL errors with errorMessage property
      const err = error as { errorMessage?: string };

      if (
        err.errorMessage &&
        err.errorMessage.indexOf("AADB2C90091") > -1
      ) {
        // user cancels the flow
        logger.warn('User cancelled the authentication flow (AADB2C90091)');
        await this.msalClient.logout();
        store.dispatch(signoutAction());
        await this.msalClient.loginRedirect(loginRequest);
        getAuthState().setAuthenticated(true);
      }

      if (
        err.errorMessage &&
        err.errorMessage.indexOf("AADB2C90118") > -1
      ) {
        logger.info('Password reset requested (AADB2C90118)');
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
          logger.error('Password reset redirect failed', err);
        }
      }

      return { error: error };
    }
  }

  async getAccessToken(scopes = null) {
    logger.debug('Getting access token', { customScopes: !!scopes });

    // Check if we already have an access token in store
    const authState = getAuthState();
    if (authState.accessToken) {
      logger.debug('Returning cached access token from store');
      return authState.accessToken;
    }

    try {
      const accounts = this.msalClient.getAllAccounts();
      logger.debug('Attempting to get token', { accountsCount: accounts.length });

      let tokenResponse = await this.msalClient.handleRedirectPromise();
      if (!tokenResponse) {
        try {
          logger.debug('Acquiring token silently');
          tokenResponse = await this.msalClient.acquireTokenSilent({
            account: accounts[0],
            scopes: scopes ? scopes : authConfig.scopes,
          });
          logger.info('Token acquired silently');
          getAuthState().setAuthenticated(true);
        } catch (error) {
          logger.warn('Silent token acquisition failed', error);

          if (error instanceof InteractionRequiredAuthError) {
            logger.info('Interaction required, redirecting for token acquisition');
            await this.msalClient.acquireTokenRedirect({
              account: accounts[0],
              scopes: scopes ? scopes : authConfig.scopes,
            });
            getAuthState().setAuthenticated(true);
          }
        }
      }

      if (tokenResponse) {
        logger.info('Access token retrieved successfully');
        getAuthState().setAuthData({
          isAuthenticated: true,
          accessToken: tokenResponse.accessToken,
          idTokenClaims: tokenResponse.idTokenClaims,
        });
        return tokenResponse.accessToken;
      }
    } catch (error) {
      logger.error('Failed to get access token', error);
      return { error: error };
    }
  }

  googleLogin(planId: string, token: string) {
    logger.info('Google login initiated', { planId });
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
    logger.info('Azure AD login initiated', { planId });
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
    logger.info('Google signup initiated', { planId });
    sessionStorage.clear();
    auth.googleLogin(planId, token);
  };

  azureSignup = (planId: string, token: string) => {
    logger.info('Azure AD signup initiated', { planId });
    sessionStorage.clear();
    auth.azureLogin(planId, token);
  };

  logout() {
    logger.info('Logout initiated');
    getAuthState().clearAuth();
    try {
      store.dispatch(signoutAction());
      fetch(import.meta.env.VITE_API_BASE_URL + "/api/user/logout", {
        method: "POST",
        headers: this.getAuthorizationHeader(),
      })
        .then(errorHandler)
        .then(function () {
          logger.info('Server logout successful, clearing local state');
          auth.msalClient.logout().then(() => {
            logger.info('MSAL logout complete');
            localStorage.clear();
            getAuthState().clearAuth();
          });
        })
        .catch((error) => {
          logger.error('Logout failed', error);
        });
    } catch (error) {
      logger.error('Logout error', error);
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
    logger.debug('Getting current user');
    const accounts = this.msalClient.getAllAccounts();

    if (accounts && accounts.length > 0) {
      const account = accounts[0];

      const idToken = getAuthState().idTokenClaims;
      if (idToken) {
        logger.debug('Current user retrieved from idToken', {
          name: idToken.name,
          email: idToken.email
        });
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

      logger.debug('Current user retrieved from account', {
        name: account.name,
        id: account.localAccountId
      });
      return {
        name: account.name,
        id: account.localAccountId,
      };
    }

    logger.warn('No current user found');
    return undefined;
  }
}
export const auth = new Auth();
