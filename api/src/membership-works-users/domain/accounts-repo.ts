import { Effect, Option } from "effect";
import { MwAccount } from "../../persistence/db/models/MwAccount";
import { MembershipWorksUserInfo } from "./types";
import { SequelizeTransaction } from "../../persistence/db/SequelizeTransaction";

export const getAccountById = (accountId: string) =>
  Effect.tryPromise({
    try: () => MwAccount.findByPk(accountId),
    catch: (unknown) =>
      new Error(`Error calling MwAccount.findByPk(${accountId})`, {
        cause: unknown,
      }),
  }).pipe(Effect.andThen(Option.fromNullable));

export const createAccount =
  (mwUserProfile: MembershipWorksUserInfo) => (userId: string) =>
    Effect.sync(() =>
      MwAccount.build({
        ...mwUserProfile,
        userId,
      })
    ).pipe(
      Effect.andThen((account) =>
        SequelizeTransaction.pipe(
          Effect.andThen((transaction) =>
            Effect.tryPromise({
              try: () => account.save({ transaction }),
              catch: (unknown) =>
                new Error(`Error calling MwAccount.save`, {
                  cause: unknown,
                }),
            })
          )
        )
      )
    );

export const updateAccount = (mwAccount: MwAccount) => (userId: string) =>
  SequelizeTransaction.pipe(
    Effect.andThen((transaction) =>
      Effect.tryPromise({
        try: () => mwAccount.update({ userId }, { transaction }),
        catch: (unknown) =>
          new Error(`Error calling MwAccount.update`, {
            cause: unknown,
          }),
      })
    )
  );
