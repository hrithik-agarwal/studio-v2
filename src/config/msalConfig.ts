import { type Configuration, LogLevel, PublicClientApplication } from "@azure/msal-browser";

// Parse environment variables
const instance = import.meta.env.VITE_B2C_CONFIG_INSTANCE;
const tenant = import.meta.env.VITE_B2C_CONFIG_TENANT;
const clientId = import.meta.env.VITE_B2C_CONFIG_CLIENT_ID;
const cacheLocation = import.meta.env.VITE_B2C_CONFIG_CACHE_LOCATION;
const scopes = JSON.parse(import.meta.env.VITE_B2C_CONFIG_SCOPES || "[]");
const policies = JSON.parse(import.meta.env.VITE_B2C_CONFIG_POLICIES || "{}");
const redirectUri = import.meta.env.VITE_B2C_CONFIG_REDIRECT_URL;

// MSAL Configuration
export const msalConfig: Configuration = {
  auth: {
    authority: instance,
    clientId: clientId,
    redirectUri: redirectUri,
    knownAuthorities: Object.values(policies).map((policy) => {
      return instance.replace(policies.signin, policy as string);
    }),
    navigateToLoginRequestUrl: false,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: cacheLocation || "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

// Create the MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL instance
await msalInstance.initialize();

// Export configuration values for use in the app
export const authConfig = {
  instance,
  tenant,
  clientId,
  cacheLocation,
  scopes: [...scopes, "openid"],
  policies,
  redirectUri,
};

// Login request configuration
export const loginRequest = {
  scopes: authConfig.scopes,
};

// Token request configuration
export const tokenRequest = {
  scopes: authConfig.scopes,
};
