import { auth } from "@/clients/authClient";
import * as React from "react";
import { useEffect, useContext } from "react";
import { AuthProviderState } from "./AuthProvider.types";

export const useAccount = () => {
  const account = useContext(Account);
  if (!account) {
    throw new Error("PartnerSettings not found");
  }
  return account;
};

const Account = React.createContext(null);
Account.displayName = "PartnerSettings";

export const AuthProvider = (props) => {
  const [authState, setAuthState] = React.useState(AuthProviderState.Loading);
  const [account, setAccount] = React.useState();

  useEffect(() => {
    if (!props.msalClient) {
      setAuthState(AuthProviderState.Error);
      return;
    }

    const login = async () => {
      const accounts = props.msalClient.getAllAccounts();

      if (
        accounts &&
        accounts.length > 0 &&
        accounts[0].homeAccountId.includes(
          auth.options.policies.signin.toLowerCase()
        )
      ) {
        const accessToken = await auth.getAccessToken();
        if (accessToken) {
          setAccount(accounts[0]);
          setAuthState(AuthProviderState.Success);
        } else {
          setAuthState(AuthProviderState.Error);
        }
      } else {
        const result = await auth.login();

        if (result.error) {
          setAuthState(AuthProviderState.Error);
        } else if (result.account && result.accessToken) {
          setAccount(result.account);
          setAuthState(AuthProviderState.Success);
        }
      }
    };

    login();
  }, []);

  if (!account) {
    return (
      <React.Fragment>
        {props.render({ account, state: authState })}
      </React.Fragment>
    );
  }

  return (
    <Account.Provider value={account}>
      {props.render({ account, state: authState })}
    </Account.Provider>
  );
};
