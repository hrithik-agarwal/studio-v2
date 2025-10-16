import { useState, useEffect, } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./clients/authClient";
import type { IUserExistsResponse } from "@/store/appStore";
import { ROUTES } from "./libs/constants";
import PrimaryButton from "./components/PrimaryButton";
import FullPageLoader from "./components/FullPageLoader";
import MessageBlock from "./components/MessageBlock";

// TODO: Import these components once they are created
// import { Signup } from "@/features/auth/components/Signup";
// import { VerifyEmail } from "@/features/auth/components/VerifyEmail";
// import { SkyPointLogin } from "@/features/auth/components/SkyPointLogin";
// import { SkypointSignUp } from "@/features/auth/components/SkypointSignUp";
// import { AuthProvider } from "@/features/auth/components/AuthProvider";
// import { AuthProviderState } from "@/features/auth/types";

// Placeholder components until the actual components are created
const Signup = () => <div>Signup Page</div>;
const VerifyEmail = () => <div>Verify Email Page</div>;
const SkyPointLogin = () => <div>SkyPoint Login Page</div>;
const SkypointSignUp = () => <div>Skypoint SignUp Page</div>;
const AccountLocked = () => <div>🔒</div>;
const Callback = () => <div>Callback Page</div>;
const AppNew = () => <div>App New</div>;


auth.initialize({
  instance: import.meta.env.VITE_B2C_CONFIG_INSTANCE,
  tenant: import.meta.env.VITE_B2C_CONFIG_TENANT,
  clientId: import.meta.env.VITE_B2C_CONFIG_CLIENT_ID,
  cacheLocation: import.meta.env.VITE_B2C_CONFIG_CACHE_LOCATION,
  scopes: JSON.parse(import.meta.env.VITE_B2C_CONFIG_SCOPES || "[]"),
  policies: JSON.parse(import.meta.env.VITE_B2C_CONFIG_POLICIES || "{}"),
  redirectUri: import.meta.env.VITE_B2C_CONFIG_REDIRECT_URL,
  postLogoutRedirectUri: window.location.href,
});

const Styles = {
  needHelpButton: {},
};


const getUser = async (): Promise<IUserExistsResponse> => {
  const user = auth.currentUser();
  if (user) {
    const userExistsRequest = { objectId: user.id };

    const response = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/api/user/checkUserExists",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userExistsRequest),
      }
    );

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  }

  throw new Error("User not logged-in");
};

const ApplicationBlock = () => {
  const [data, setData] = useState<IUserExistsResponse>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUser().then(
      (data) => {
        setData(data);
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
        setError(error);
        setIsLoading(false);
      }
    );
  }, []);

  if (isLoading) {
    return <FullPageLoader />;
  } else if (error) {
    return <MessageBlock>Something went wrong: {error.message}</MessageBlock>;
  } else if (!data || !data.isSuccessful) {
    return (
      <MessageBlock>
        <AccountLocked />
        <h3>Your account is locked. Contact support.</h3>
        <h4>
          Click here to{" "}
          <a href="#" onClick={() => auth.logout()}>
            Sign out
          </a>
        </h4>
        <a href="https://skypointcloud.com/customer-support/">
          <PrimaryButton
            text="Need help?"
            styles={Styles.needHelpButton}
            iconProps={{
              iconName: "HeadsetSolid",
              styles: { root: { color: "#FFFFF" } },
            }}
          />
        </a>
      </MessageBlock>
    );
  } else if (!auth?.currentUser()?.isAccountEnabled) {
    return (
      <MessageBlock>
        <h3>
          Your account has been locked. Contact your support person to unlock
          it, then try again.
        </h3>
        <h4>
          Click here to
          <a href="#" onClick={() => auth.logout()}>
            Sign out
          </a>
        </h4>
      </MessageBlock>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.CALLBACK} element={<Callback />} />
          <Route path="*" element={<AppNew />} />
        </Routes>
      </BrowserRouter>
    );
  }
};
const App = () => {
  const url = window.location.href;

  if (
    url.includes("/signup") ||
    url.includes("/verifyemail") ||
    url.includes("/skypointlogin") ||
    url.includes("/skypointsignup")
  ) {
    return (
      <BrowserRouter>
        <div
          className="wrapper"
          style={{ overflowX: "visible", overflowY: "visible" }}
        >
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />
            <Route path="/skypointlogin" element={<SkyPointLogin />} />
            <Route path="/skypointsignup" element={<SkypointSignUp />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  } else {
    return (
      <AuthProvider
        msalClient={auth.msalClient || {}}
        render={({ state }) =>
          state === AuthProviderState.Success ? (
            <ApplicationBlock />
          ) : (
            <FullPageLoader />
          )
        }
      />
    );
  }
};

export default App;
