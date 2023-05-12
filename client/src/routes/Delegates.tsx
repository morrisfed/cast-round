import * as E from "fp-ts/lib/Either";

import { useLoaderData } from "react-router-dom";
import { getDelegates } from "api/delegates";
import DelegateList from "components/Delegate/DelegateList";

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

  return <DelegateList delegates={delegates} />;
};

export default Delegates;
