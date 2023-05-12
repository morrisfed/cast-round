import { AccountUserInfo } from "api/accounts";
import React from "react";
import MemberIcon from "../MemberIcon";
import { Link } from "react-router-dom";

export interface AccountListItemProps {
  account: AccountUserInfo;
}

const AccountItem: React.FC<AccountListItemProps> = ({ account }) => {
  return (
    <Link to={`/accounts/${account.userId}`}>
      <div className="card-bordered card w-80 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="flex-0">
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
