import { DelegateUserInfo } from "api/delegates";
import React, { useMemo } from "react";

export interface DelegateTableProps {
  delegates: readonly DelegateUserInfo[];
}

const DelegateTable: React.FC<DelegateTableProps> = ({ delegates }) => {
  const items = useMemo(() => {
    return delegates.map((delegate) => {
      return (
        <tr key={delegate.userId}>
          <td>
            <div className="flex items-center space-x-3">
              <div>
                <div className="max-w-xs truncate whitespace-normal font-bold">
                  {delegate.label}
                </div>
                <div className="whitespace-normal text-sm opacity-60">
                  <span className="badge-ghost badge badge-sm">
                    {delegate.type}
                  </span>
                </div>
              </div>
            </div>
          </td>
          <td>
            <br />
          </td>
        </tr>
      );
    });
  }, [delegates]);

  return (
    <div className="">
      <table className="table">
        <thead>
          <tr>
            <th>Delegate</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
    </div>
  );
};

export default DelegateTable;
