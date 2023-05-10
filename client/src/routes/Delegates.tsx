import * as E from "fp-ts/lib/Either";

import { useLoaderData } from "react-router-dom";
import { getDelegates } from "api/delegates";
import DelegateTable from "components/Delegate/DelegateTable";

export async function delegatesLoader() {
  const getDelegatesTask = getDelegates();

  const delegateEither = await getDelegatesTask();

  if (E.isLeft(delegateEither)) {
    throw delegateEither.left;
  }

  return delegateEither.right;
}

const Delegates: React.FC = () => {
  const delegates = useLoaderData() as Awaited<
    ReturnType<typeof delegatesLoader>
  >;

  return <DelegateTable delegates={delegates} />;
};

export default Delegates;
