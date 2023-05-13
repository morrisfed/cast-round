import { AccountUserInfo } from "api/accounts";
import React, { useMemo } from "react";
import AccountItem from "./AccountItem";

export interface AccountListProps {
  accounts: readonly AccountUserInfo[];
}

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  const items = useMemo(() => {
    return accounts.map((account) => {
      return (
        <div key={account.userId} className="grow sm:w-80">
          <AccountItem account={account} />
        </div>
      );
    });
  }, [accounts]);

  return <div className="flex flex-row flex-wrap gap-2">{items}</div>;
};

export default AccountList;
