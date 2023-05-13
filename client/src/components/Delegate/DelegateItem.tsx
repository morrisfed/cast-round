import React from "react";
import MemberIcon from "../MemberIcon";
import { Link } from "react-router-dom";
import { DelegateUserInfo } from "api/delegates";

export interface DelegateListItemProps {
  delegate: DelegateUserInfo;
}

const DelegateItem: React.FC<DelegateListItemProps> = ({ delegate }) => {
  return (
    <Link to={`/delegates/${delegate.userId}`}>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="shrink-0">
              <MemberIcon isIndividual={delegate.type === "tellor-delegate"} />
            </div>
            <div className="truncate">
              <h2 className="card-title">{delegate.label}</h2>
              <span className="badge-ghost badge badge-sm">
                {delegate.type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DelegateItem;
