import { Effect, Exit, Scope } from "effect";
import { UnknownException } from "effect/Cause";
import { SequelizeTransaction } from "./SequelizeTransaction";
import sequelize from "../../model/db";

export const wrapWithTransaction = <A, E = never, R = never>(
  effect: Effect.Effect<A, E, R | SequelizeTransaction>
): Effect.Effect<
  A,
  E | UnknownException,
  Exclude<Exclude<R, SequelizeTransaction>, Scope.Scope>
> => {
  const aquireRelease = Effect.acquireRelease(
    Effect.promise(() => sequelize.transaction()),
    (transaction, exit) =>
      Exit.isFailure(exit)
        ? Effect.promise(() => transaction.rollback())
        : Effect.void
  );

  const effectWithCommit = effect.pipe(
    Effect.tap(() =>
      SequelizeTransaction.pipe(
        Effect.andThen((transaction) =>
          Effect.tryPromise(() => transaction.commit())
        )
      )
    )
  );

  return aquireRelease.pipe(
    Effect.andThen(SequelizeTransaction.of),
    Effect.andThen((st) =>
      Effect.provideService(effectWithCommit, SequelizeTransaction, st)
    ),
    Effect.scoped
  );
};
