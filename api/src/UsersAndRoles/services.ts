import { Effect, Schema } from "effect";
import { randomUUID } from "node:crypto";
import { createUser, getUser } from "./domain/users-repo";
import { User } from "./types";

export const createUserService = (
  userType: "mwAccount" | "link",
  displayName: string,
  rolesAppId: string,
  roleNames: readonly string[]
) =>
  Effect.sync(() => randomUUID()).pipe(
    Effect.andThen((userId) =>
      createUser(
        userType,
        displayName,
        rolesAppId,
        roleNames
      )(userId).pipe(
        Effect.andThen((dbUser) => Schema.decodeUnknown(User)(dbUser)),
        Effect.catchTag("ParseError", (err) =>
          Effect.fail(
            new Error(
              `Failed to parse User from database for userId: ${userId}`
            )
          )
        )
      )
    )
  );

export const getUserService = (userId: string) => getUser(userId);
