import { AccountUserInfo } from "api/accounts";
import React from "react";

export interface AccountListItemProps {
  account: AccountUserInfo;
}

const AccountListItem: React.FC<AccountListItemProps> = ({ account }) => {
  return (
    <div>
      <h2>{account.name}</h2>
      <h3>{account.contactName}</h3>
      <p>{account.type}</p>
    </div>
  );
};

export default AccountListItem;
