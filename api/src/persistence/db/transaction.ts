import { Effect, Exit, Scope } from "effect";
import { SequelizeTransaction } from "./SequelizeTransaction";
import sequelize from "../../model/db";

export const wrapWithTransaction = <A, E = never, R = never>(
  effect: Effect.Effect<A, E, R | SequelizeTransaction>
): Effect.Effect<
  A,
  E | Error,
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
          Effect.tryPromise({
            try: () => transaction.commit(),
            catch: (unknown) =>
              new Error(`Error calling transaction.commit`, {
                cause: unknown,
              }),
          })
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
