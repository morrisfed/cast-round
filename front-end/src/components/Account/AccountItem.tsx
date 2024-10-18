import { AccountUserInfo } from "api/accounts";
import React from "react";
import MemberIcon from "../MemberIcon";
import { Link } from "react-router-dom";

export interface AccountListItemProps {
  account: AccountUserInfo;
  linkPathPrefix: string;
}

const AccountItem: React.FC<AccountListItemProps> = ({
  account,
  linkPathPrefix,
}) => {
  return (
    <Link to={`${linkPathPrefix}${account.id}`}>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="shrink-0">
              <MemberIcon isIndividual={account.isIndividual} />
            </div>
            <div className="truncate">
              <h2 className="card-title">{account.name}</h2>
              <p>{account.contactName}</p>
              <span className="badge-ghost badge badge-sm">{account.type}</span>
              {/* <p>{account.userId}</p> */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AccountItem;
