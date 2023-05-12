import React, { useMemo } from "react";
import { DelegateUserInfo } from "api/delegates";
import DelegateItem from "./DelegateItem";

export interface DelegateListProps {
  delegates: readonly DelegateUserInfo[];
}

const DelegateList: React.FC<DelegateListProps> = ({ delegates }) => {
  const items = useMemo(() => {
    return delegates.map((delegate) => {
      return (
        <div key={delegate.userId}>
          <DelegateItem delegate={delegate} />
        </div>
      );
    });
  }, [delegates]);

  return <div className="flex flex-row flex-wrap gap-2">{items}</div>;
};

export default DelegateList;
