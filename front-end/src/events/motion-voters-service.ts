import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as ROA from "fp-ts/lib/ReadonlyArray";
import * as PRED from "fp-ts/lib/Predicate";

import { AccountUserType, getAccounts as apiGetAccounts } from "api/accounts";
import { AccountUserInfo } from "api/accounts";

let voters: readonly AccountUserInfo[] = [];

let votersPromise:
  | Promise<E.Either<Error | "forbidden", readonly AccountUserInfo[]>>
  | undefined = undefined;

export const isGroupAccountType = (
  accountType: AccountUserType | undefined
): boolean =>
  accountType === "group-membership" ||
  accountType === "junior-membership" ||
  accountType === "associate-membership" ||
  accountType === "overseas-membership";

export const isIndividualAccountType = (
  accountType: AccountUserType | undefined
): boolean =>
  accountType === "individual-membership" || accountType === "honorary";

const accountIsVoter = (account: AccountUserInfo) =>
  isGroupAccountType(account.type) || isIndividualAccountType(account.type);

const createGetVotorsPromise = () =>
  pipe(
    apiGetAccounts(),
    TE.map((accounts) => accounts.filter(accountIsVoter))
  )();

export const getVoters = (): TE.TaskEither<
  Error | "forbidden",
  readonly AccountUserInfo[]
> => {
  const localVotersPromise = votersPromise ?? createGetVotorsPromise();

  votersPromise = localVotersPromise;

  // If there is an error getting voters, clear the cached voters promise so new calls to getVoters
  // will try to retrieve accounts again.
  localVotersPromise.then((result) => {
    if (E.isLeft(result)) {
      votersPromise = undefined;
    } else {
      voters = result.right;
    }
  });

  return () => localVotersPromise!;
};

export const getVoterById = (
  voterId: string
): TE.TaskEither<Error | "forbidden", O.Option<AccountUserInfo>> =>
  pipe(getVoters(), TE.map(ROA.findFirst((voter) => voter.id === voterId)));

export const refreshVoters = (): TE.TaskEither<
  Error | "forbidden",
  readonly AccountUserInfo[]
> => {
  votersPromise = undefined;
  return getVoters();
};

const filterAccount =
  (filterString: string): PRED.Predicate<AccountUserInfo> =>
  (account) => {
    const name = account.name.toLowerCase();
    const contactName = account.contactName?.toLowerCase() ?? "";
    const filterLC = filterString.toLowerCase();

    return name.includes(filterLC) || contactName.includes(filterLC);
  };

export const getFilteredVoters = (
  filterString: string
): TE.TaskEither<Error | "forbidden", readonly AccountUserInfo[]> =>
  pipe(getVoters(), TE.map(ROA.filter(filterAccount(filterString))));
