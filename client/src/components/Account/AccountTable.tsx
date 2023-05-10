import { AccountUserInfo } from "api/accounts";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export interface AccountTableProps {
  accounts: readonly AccountUserInfo[];
}

const AccountTable: React.FC<AccountTableProps> = ({ accounts }) => {
  const items = useMemo(() => {
    return accounts.map((account) => {
      return (
        <tr key={account.id}>
          <td>
            {account.isIndividual ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            )}
          </td>
          <td>
            <div className="flex items-center space-x-3">
              <div>
                <div className="max-w-xs truncate whitespace-normal font-bold">
                  {account.name}
                </div>
                <div className="whitespace-normal text-sm opacity-60">
                  {account.contactName}
                  <span className="badge-ghost badge badge-sm">
                    {account.type}
                  </span>
                </div>
              </div>
            </div>
          </td>
          <td>
            <Link to={"/accounts/" + account.id} className="btn">
              View
            </Link>
          </td>
        </tr>
      );
    });
  }, [accounts]);

  return (
    <div className="">
      <table className="table">
        <thead>
          <tr>
            <th>Indiv/Grp</th>
            <th>Account</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
    </div>
  );
};

export default AccountTable;
