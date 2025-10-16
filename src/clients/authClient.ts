import { errorHandler } from "./errorhandler";
import queryString from "query-string";
import store from "@/store/store";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { signoutAction } from "@/store/auth/authActions";
import { msalInstance, authConfig, loginRequest } from "@/config/msalConfig";

class Auth {
  // Use the centralized MSAL instance
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
          window.isAuthenticated = true;
        }
      }

      if (accountObj && tokenResponse) {
        window.accessToken = tokenResponse.accessToken;
        window.idTokenClaims = tokenResponse.idTokenClaims;
        window.isAuthenticated = true;
        return { account: accountObj, accessToken: tokenResponse.accessToken };
      } else if (accountObj) {
        try {
          tokenResponse = await this.msalClient.acquireTokenSilent({
            account: this.msalClient.getAllAccounts()[0],
            scopes: authConfig.scopes,
          });
          window.isAuthenticated = true;
        } catch (err) {
          if (err instanceof InteractionRequiredAuthError) {
            await this.msalClient.acquireTokenRedirect({
              scopes: authConfig.scopes,
            });
            window.isAuthenticated = true;
          }
        }
      } else {
        if (this.loginInProgress()) {
          return {};
        }

        await this.msalClient.loginRedirect(loginRequest);
        window.isAuthenticated = true;
      }

      if (tokenResponse) {
        window.accessToken = tokenResponse.accessToken;
        window.idTokenClaims = tokenResponse.idTokenClaims;
        window.isAuthenticated = true;
        return { account: accountObj, accessToken: tokenResponse.accessToken };
      }

      return { error: "unknown error" };
    } catch (error) {
      console.error(error);

      if (
        error.errorMessage &&
        error.errorMessage.indexOf("AADB2C90091") > -1
      ) {
        // user cancels the flow
        await this.msalClient.logout();
        store.dispatch(signoutAction());
        await this.msalClient.loginRedirect(loginRequest);
        window.isAuthenticated = true;
      }

      if (
        error.errorMessage &&
        error.errorMessage.indexOf("AADB2C90118") > -1
      ) {
        try {
          // Password reset policy/authority
          await this.msalClient.loginRedirect({
            scopes: authConfig.scopes,
            authority: authConfig.instance.replace(
              authConfig.policies.signin,
              authConfig.policies.resetpassword
            ),
          });
          window.isAuthenticated = true;
        } catch (err) {
          console.error(err);
        }
      }

      return { error: error };
    }
  }

  async getAccessToken(scopes = null) {
    //if (window.accessToken) {
    //    return window.accessToken;
    //}

    try {
      const accounts = this.msalClient.getAllAccounts();
      let tokenResponse = await this.msalClient.handleRedirectPromise();
      if (!tokenResponse) {
        try {
          tokenResponse = await this.msalClient.acquireTokenSilent({
            account: accounts[0],
            scopes: scopes ? scopes : authConfig.scopes,
          });
          window.isAuthenticated = true;
        } catch (error) {
          console.error(error);

          if (error instanceof InteractionRequiredAuthError) {
            await this.msalClient.acquireTokenRedirect({
              account: accounts[0],
              scopes: scopes ? scopes : authConfig.scopes,
            });
            window.isAuthenticated = true;
          }
        }
      }

      if (tokenResponse) {
        window.idTokenClaims = tokenResponse.idTokenClaims;
        window.accessToken = tokenResponse.accessToken;
        window.isAuthenticated = true;
        return tokenResponse.accessToken;
      }
    } catch (error) {
      console.error(error);
      return { error: error };
    }
  }

  googleLogin(planId, token) {
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

  azureLogin(planId, token) {
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

  googleSignup = (planId, token) => {
    sessionStorage.clear();
    auth.googleLogin(planId, token);
  };

  azureSignup = (planId, token) => {
    sessionStorage.clear();
    auth.azureLogin(planId, token);
  };

  logout() {
    window.isAuthenticated = false;
    try {
      store.dispatch(signoutAction());
      fetch(import.meta.env.VITE_API_BASE_URL + "/api/user/logout", {
        method: "POST",
        headers: this.getAuthorizationHeader(),
      })
        .then(errorHandler)
        .then(function () {
          auth.msalClient.logout().then(() => {
            console.log("user logged out");
            localStorage.clear();
            window.idTokenClaims = undefined;
            window.accessToken = undefined;
          });
        });
    } catch (error) {
      console.error(error);
    }
  }

  getMultiPartAuthorizationHeader() {
    var accessToken = window.accessToken;
    var instanceId;
    if (window.location && window.location.search) {
      const values = queryString.parse(window.location.search);
      instanceId = values.instanceid;
    }

    return new Headers({
      Authorization: `Bearer ${accessToken}`,
      InstanceId: instanceId,
    });
  }

  getAuthorizationHeader() {
    var accessToken = window.accessToken; //this.getAccessToken();
    var instanceId;
    if (window.location && window.location.search) {
      const values = queryString.parse(window.location.search);
      instanceId = values.instanceid;
    }

    return new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      InstanceId: instanceId,
    });
  }
  getHeader() {
    const accessToken = window.accessToken; //this.getAccessToken();
    let instanceId;
    if (window.location && window.location.search) {
      const values = queryString.parse(window.location.search);
      instanceId = values.instanceid;
    }

    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      InstanceId: instanceId,
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
    var currentUser = this.currentUser();
    var accessToken = window.accessToken; //this.getAccessToken();
    var instanceId;
    if (window.location && window.location.search) {
      const values = queryString.parse(window.location.search);
      instanceId = values.instanceid;
    }
    return new Headers({
      Authorization: `Bearer ${accessToken}`,
      InstanceId: instanceId,
    });
  }

  currentUser() {
    const accounts = this.msalClient.getAllAccounts();

    if (accounts && accounts.length > 0) {
      var account = accounts[0];

      var idToken = window.idTokenClaims;
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
        id: account.homeAccountId,
      };
    }
  }
}
export const auth = new Auth();
