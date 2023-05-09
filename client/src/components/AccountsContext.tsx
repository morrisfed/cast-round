import React, { useCallback, useContext, useEffect, useState } from "react";

import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { pipe } from "fp-ts/lib/function";
import { AccountUserInfo, getAccounts } from "api/accounts";
import { useUserProfile } from "./UserProfileContext";

/**
 * Provides the accounts available to the user from the server api.
 */

export type IAccountsContext = {
  loaded: boolean;
  accounts: O.Option<readonly AccountUserInfo[]>;
};

const AccountsContext = React.createContext<IAccountsContext>({
  loaded: false,
  accounts: O.none,
});

const AccountsContextProvider = ({ children }: { children: JSX.Element }) => {
  const [accounts, setAccounts] = useState<
    O.Option<readonly AccountUserInfo[]>
  >(O.none);
  const { userProfile } = useUserProfile();
  const [loaded, setLoaded] = useState(false);

  const fetchAccounts = useCallback(async () => {
    const fetchAccountsTask = pipe(
      getAccounts(),

      TE.fold(
        () => {
          setAccounts(O.none);
          return T.of(setLoaded(true));
        },
        (accounts) => {
          setAccounts(O.some(accounts));
          return T.of(setLoaded(true));
        }
      )
    );

    await fetchAccountsTask();
  }, []);

  useEffect(() => {
    if (O.isSome(userProfile)) {
      fetchAccounts();
    }
  }, [fetchAccounts, userProfile]);

  return (
    <AccountsContext.Provider
      value={{
        loaded,
        accounts,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

const useAccounts = () => useContext(AccountsContext);

export { AccountsContextProvider, useAccounts };
