import * as E from "fp-ts/lib/Either";

import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { getAccountDelegates } from "api/accounts";
import { pipe } from "fp-ts/lib/function";
import { useMemo } from "react";
import DelegateTable from "components/Delegate/DelegateTable";

export async function accountDelegatesLoader({ params }: LoaderFunctionArgs) {
  const accountId = params.accountId;
  if (!accountId) {
    throw new Error("No account ID provided");
  }

  const getAccountDelegatesTask = pipe(getAccountDelegates(accountId));

  const delegatesEither = await getAccountDelegatesTask();

  if (E.isLeft(delegatesEither)) {
    throw delegatesEither.left;
  }

  return delegatesEither.right;
}

const AccountDelegates: React.FC = () => {
  const delegates = useLoaderData() as Awaited<
    ReturnType<typeof accountDelegatesLoader>
  >;

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
        </tr>
      );
    });
  }, [delegates]);

  return <DelegateTable delegates={delegates} />;
};

export default AccountDelegates;
