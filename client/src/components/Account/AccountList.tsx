import { AccountUserInfo } from "api/accounts";
import React, { useMemo } from "react";
import AccountItem from "./AccountItem";

export interface AccountListProps {
  accounts: readonly AccountUserInfo[];
  linkPathPrefix: string;
}

const AccountList: React.FC<AccountListProps> = ({
  accounts,
  linkPathPrefix,
}) => {
  const items = useMemo(() => {
    return accounts.map((account) => {
      return (
        <div key={account.id} className="grow sm:w-80">
          <AccountItem account={account} linkPathPrefix={linkPathPrefix} />
        </div>
      );
    });
  }, [accounts, linkPathPrefix]);

  return <div className="flex flex-row flex-wrap gap-2">{items}</div>;
};

export default AccountList;
