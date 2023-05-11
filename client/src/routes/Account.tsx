import * as E from "fp-ts/lib/Either";

import {
  Link,
  LoaderFunctionArgs,
  Outlet,
  useLoaderData,
} from "react-router-dom";
import { getAccount } from "api/accounts";

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

const Account: React.FC = () => {
  const account = useLoaderData() as Awaited<ReturnType<typeof accountLoader>>;

  return (
    <div>
      <h1>Account</h1>
      <p>Account ID: {account.userId}</p>
      <p>Account Name: {account.name}</p>
      <p>Account Contact: {account.contactName}</p>
      <Link className="btn-outline btn-accent btn" to="newdelegate">
        Add new delegate
      </Link>
      <Outlet />
    </div>
  );
};

export default Account;
