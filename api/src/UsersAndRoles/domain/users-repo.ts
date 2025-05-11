import { Effect, Option } from "effect";
import { User } from "../../persistence/db/models/User";
import { SequelizeTransaction } from "../../persistence/db/SequelizeTransaction";

export const createUser =
  (userType: "mwAccount" | "link", displayName: string, roles: { name: string; appId: string }[]) =>
  (userId: string) =>
    Effect.sync(() =>
      User.build({
        userId,
        userType,
        displayName,
        roles,
      })
    ).pipe(
      Effect.andThen((user) =>
        SequelizeTransaction.pipe(
          Effect.andThen((transaction) =>
            Effect.tryPromise({
              try: () => user.save({ transaction }),
              catch: (unknown) =>
                new Error(`Error calling User.save`, {
                  cause: unknown,
                }),
            })
          )
        )
      )
    );

export const getUser = (userId: string) =>
  SequelizeTransaction.pipe(
    Effect.andThen((transaction) =>
      Effect.tryPromise({
        try: () => User.findByPk(userId, { transaction }),
        catch: (unknown) =>
          new Error(`Error calling User.findByPk(${userId})`, {
            cause: unknown,
          }),
      })
    ),
    Effect.andThen(Option.fromNullable)
  );
