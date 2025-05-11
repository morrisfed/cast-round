import { Array, Effect, Equivalence, Option, Order, Data, Equal } from "effect";
import { User } from "../../persistence/db/models/User";
import { SequelizeTransaction } from "../../persistence/db/SequelizeTransaction";
import { RoleDefinition, RolesCollection } from "../types";

const appRolesToRolesCollection = (
  rolesAppId: string,
  roleNames: readonly string[]
) =>
  roleNames.map((roleName) =>
    Data.struct({
      appId: rolesAppId,
      name: roleName,
    })
  );

const roleByAppThenName = Order.mapInput(
  Order.string,
  (role: RoleDefinition) => role.appId + role.name
);

const sortRolesCollection = (input: RolesCollection): RolesCollection =>
  Array.sort(roleByAppThenName)(input);

const rolesEqual = (a: RolesCollection, b: RolesCollection) =>
  Equal.equals(a, b);

const appEquiv = Equivalence.mapInput(
  Equivalence.string,
  (role: RoleDefinition) => role.appId
);
const nameEquiv = Equivalence.mapInput(
  Equivalence.string,
  (role: RoleDefinition) => role.name
);

const combinedEquiv = Equivalence.combine(appEquiv, nameEquiv);

export const createUser =
  (
    userType: "mwAccount" | "link",
    displayName: string,
    rolesAppId: string,
    roleNames: readonly string[]
  ) =>
  (userId: string) =>
    Effect.sync(() =>
      User.build({
        userId,
        userType,
        displayName,
        roles: sortRolesCollection(
          appRolesToRolesCollection(rolesAppId, roleNames)
        ),
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
