import * as E from "fp-ts/lib/Either";

import { useLoaderData } from "react-router-dom";
import AccountTable from "components/Account/AccountTable";
import { getAccounts } from "api/accounts";

export async function accountsLoader() {
  const getAccountsTask = getAccounts();

  const accountsEither = await getAccountsTask();

  if (E.isLeft(accountsEither)) {
    throw accountsEither.left;
  }

  return accountsEither.right;
}

const Accounts: React.FC = () => {
  const accounts = useLoaderData() as Awaited<
    ReturnType<typeof accountsLoader>
  >;

  return <AccountTable accounts={accounts} />;
};

export default Accounts;
