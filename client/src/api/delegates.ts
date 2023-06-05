import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as ROA from "fp-ts/lib/ReadonlyArray";

import axios from "axios";

export type DelegateUserType = "group-delegate" | "tellor-delegate";

export interface DelegateUserInfo {
  id: string;
  label: string;
  createdBy: { id: string };
  type: DelegateUserType;
}

export interface GetDelegatesResponse {
  accounts: readonly {
    id: string;
    label: string;
    createdBy: { id: string };
    type: DelegateUserType;
  }[];
}

const retrieveDelegates = (): TE.TaskEither<
  Error | "forbidden",
  readonly DelegateUserInfo[]
> =>
  pipe(
    TE.tryCatch(
      () => axios.get<GetDelegatesResponse>("/api/delegates"),
      (reason: any) =>
        reason.response.status === 403 ? "forbidden" : new Error(`${reason}`)
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.accounts),
    TE.map(
      ROA.map((retAcc) => ({
        ...retAcc,
      }))
    )
  );

export const getDelegates = () => pipe(retrieveDelegates());
