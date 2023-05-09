import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as ROA from "fp-ts/lib/ReadonlyArray";

import axios from "axios";

export type AccountUserType =
  | "associate-membership"
  | "committee"
  | "friend"
  | "group-membership"
  | "honorary"
  | "individual-membership"
  | "junior-membership"
  | "overseas-membership";

const isGroupType = (type: AccountUserType): boolean => {
  switch (type) {
    case "associate-membership":
    case "group-membership":
    case "junior-membership":
    case "overseas-membership":
      return true;
    default:
      return false;
  }
};

export interface AccountUserInfo {
  id: string;
  name: string;
  contactName: string | null;
  type: AccountUserType;
  isGroup: boolean;
  isIndividual: boolean;
}

export interface GetAccountsResponse {
  accounts: readonly {
    id: string;
    name: string;
    contactName: string | null;
    type: AccountUserType;
  }[];
}

const retreiveAccounts = (): TE.TaskEither<
  Error | "forbidden",
  readonly AccountUserInfo[]
> =>
  pipe(
    TE.tryCatch(
      () => axios.get<GetAccountsResponse>("/api/accounts"),
      (reason) =>
        reason.response.status === 403 ? "forbidden" : new Error(`${reason}`)
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.accounts),
    TE.map(
      ROA.map((retAcc) => ({
        ...retAcc,
        isGroup: isGroupType(retAcc.type),
        isIndividual: !isGroupType(retAcc.type),
      }))
    ),
    TE.map(ROA.takeLeft(100))
  );

export const getAccounts = () => pipe(retreiveAccounts());
