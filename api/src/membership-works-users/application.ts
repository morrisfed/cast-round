import { Effect } from "effect";
import { getMwUserProfileForToken } from "./fetchMwUserInfo";
import {
  createAccount,
  getAccountById,
  updateAccount,
} from "./domain/accounts-repo";
import { MembershipWorksUserInfo } from "./domain/types";
import { createUserService, getUserService } from "../UsersAndRoles/services";
import { MwAccount } from "../persistence/db/models/MwAccount";

const createMwUser = (mwUserProfile: MembershipWorksUserInfo) =>
  createUserService(
    "mwAccount",
    mwUserProfile.accountName,
    "membership-works-users",
    mwUserProfile.membershipAndLabels
  ).pipe(Effect.tap((user) => createAccount(mwUserProfile)(user.userId)));

const createUserAndUpdateMwAccount = (mwAccount: MwAccount) =>
  createUserService(
    "mwAccount",
    mwAccount.accountName,
    "membership-works-users",
    mwAccount.membershipAndLabels
  ).pipe(Effect.tap((user) => updateAccount(mwAccount)(user.userId)));

export const loginMwUser = (accessToken: string) =>
  getMwUserProfileForToken(accessToken).pipe(
    Effect.andThen((mwProfile) =>
      getAccountById(mwProfile.accountId).pipe(
        Effect.andThen((account) =>
          getUserService(account.userId).pipe(
            // If we have a User ID, but the user cannot be found, then we have a data consistency issue.
            // Create the new user and fix up the MW Account record.
            Effect.catchTag("NoSuchElementException", () =>
              createUserAndUpdateMwAccount(account)
            )
          )
        ),
        Effect.catchTag("NoSuchElementException", () => createMwUser(mwProfile))
      )
    )
  );
