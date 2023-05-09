import { AccountUserInfo } from "api/accounts";
import React, { useMemo } from "react";
import AccountListItem from "./AccountListItem";

export interface AccountListProps {
  accounts: readonly AccountUserInfo[];
}

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  const items = useMemo(() => {
    return accounts.map((account) => {
      return (
        <div key={account.id}>
          <AccountListItem account={account} />
        </div>
      );
    });
  }, [accounts]);

  return <div>{items}</div>;
};

export default AccountList;
