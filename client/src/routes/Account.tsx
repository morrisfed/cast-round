import * as E from "fp-ts/lib/Either";

import {
  LoaderFunctionArgs,
  NavLink,
  NavLinkProps,
  Outlet,
  useLoaderData,
} from "react-router-dom";
import { getAccount } from "api/accounts";
import { CrumbDataFn } from "components/Crumb";

const tabClassName: NavLinkProps["className"] = ({ isActive, isPending }) =>
  `tab-bordered tab ${isActive ? "tab-active" : ""} ${
    isPending ? "tab-active" : ""
  }`;

export async function accountLoader({ params }: LoaderFunctionArgs) {
  const accountId = params.accountId;
  if (!accountId) {
    throw new Error("No account ID provided");
  }

  const getAccountTask = getAccount(accountId);

  const accountEither = await getAccountTask();

  if (E.isLeft(accountEither)) {
    throw accountEither.left;
  }

  return accountEither.right;
}

export const AccountCrumb: CrumbDataFn = (match) => {
  const data = match.data as Awaited<ReturnType<typeof accountLoader>>;
  return { path: `/accounts/${data.id}`, label: data.name };
};

const Account: React.FC = () => {
  const account = useLoaderData() as Awaited<ReturnType<typeof accountLoader>>;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{account.name}</h2>
          <p>{account.contactName}</p>
          <p>{account.id}</p>
        </div>
      </div>
      <div className="tabs">
        <NavLink to="" className={tabClassName} end>
          Delegates
        </NavLink>
        <NavLink to="newdelegate" className={tabClassName} end>
          Add new delegate
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Account;
