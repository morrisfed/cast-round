import React from "react";

import * as E from "fp-ts/lib/Either";

import { useLoaderData } from "react-router-dom";
import AccountTable from "components/Account/AccountTable";
import { getAccounts } from "api/accounts";
import AccountList from "components/Account/AccountList";

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
      <div className="form-control">
        <label className="input-group">
          <span>Filter</span>
          <input
            type="text"
            placeholder="Filter accounts"
            className="input-bordered input"
            value={filterString}
            onChange={(e) => setFilterString(e.target.value)}
          />
          {filterString.length > 0 ? (
            <button
              className="btn-ghost btn-circle btn"
              onClick={() => setFilterString("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          ) : null}
        </label>
      </div>
      <AccountList accounts={filteredAccounts} />
    </div>
  );
};

export default Accounts;
