import { Effect } from "effect";
import { subscribeToDomainEvents } from "../services/domain-events/subscriptions";

export const initUsersAndRoles = () => {
  subscribeToDomainEvents("users-and-roles")(["RolesRegisteredDomainEvent"])(
    (event) =>
      Effect.log(`users-and-roles callback: ${JSON.stringify(event)}`).pipe(
        Effect.andThen(Effect.succeed(event))
      )
  );

  subscribeToDomainEvents("users-and-roles2")(["RolesRegisteredDomainEvent"])(
    (event) =>
      Effect.log(`users-and-roles2 callback: ${JSON.stringify(event)}`).pipe(
        Effect.andThen(Effect.succeed(event))
      )
  );
};
