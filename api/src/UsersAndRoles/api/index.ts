import { Effect } from "effect";
import { RegisteredRole } from "../../persistence/db/models/RegisteredRole";
import { SequelizeTransaction } from "../../persistence/db/SequelizeTransaction";
import { wrapWithTransaction } from "../../persistence/db/transaction";
import {
  publishRolesRegisteredDomainEvent,
  RolesRegisteredDomainEvent,
} from "../domain-events/events";

const ensureRoleExists = (appId: string, roleName: string) =>
  SequelizeTransaction.pipe(
    Effect.andThen((transaction) =>
      Effect.tryPromise(() =>
        RegisteredRole.findOrCreate({
          where: {
            appId,
            name: roleName,
          },
          transaction,
        })
      ).pipe(Effect.map(([registeredRole]) => registeredRole))
    )
  );

export const registerRolesForApplication = (
  appId: string,
  roleNames: string[]
) =>
  wrapWithTransaction(
    Effect.forEach(roleNames, (roleName) =>
      ensureRoleExists(appId, roleName)
    ).pipe(
      Effect.tap(() =>
        publishRolesRegisteredDomainEvent(
          RolesRegisteredDomainEvent({ appId, roleNames })
        )
      )
    )
  );
