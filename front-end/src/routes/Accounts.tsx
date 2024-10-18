import React from "react";

import * as E from "fp-ts/lib/Either";

import { useLoaderData } from "react-router-dom";
import { getAccounts } from "api/accounts";
import AccountList from "components/Account/AccountList";
import { CrumbDataFn } from "components/Crumb";
import FilterInput from "components/FilterInput";

export async function accountsLoader() {
  const getAccountsTask = getAccounts();

  const accountsEither = await getAccountsTask();

  if (E.isLeft(accountsEither)) {
    throw accountsEither.left;
  }

  return accountsEither.right;
}

export const AccountsCrumb: CrumbDataFn = () => {
  return { label: "Accounts" };
};

const Accounts: React.FC = () => {
  const accounts = useLoaderData() as Awaited<
    ReturnType<typeof accountsLoader>
  >;

  const [filterString, setFilterString] = React.useState("");
  const [filteredAccounts, setFilteredAccounts] = React.useState(accounts);

  React.useEffect(() => {
    if (filterString.length === 0) {
      setFilteredAccounts(accounts);
    } else {
      const filteredAccounts = accounts.filter(
        (account) =>
          account.name.toLowerCase().includes(filterString.toLowerCase()) ||
          account.contactName
            ?.toLowerCase()
            .includes(filterString.toLowerCase())
      );
      setFilteredAccounts(filteredAccounts);
    }
  }, [filterString, accounts]);

  return (
    <div className="flex flex-col gap-2">
      <FilterInput
        filterString={filterString}
        setFilterString={setFilterString}
      />

      <AccountList accounts={filteredAccounts} linkPathPrefix="" />
    </div>
  );
};

export default Accounts;
