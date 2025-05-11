import { Effect } from "effect";
import app from "./app";
import { registerRolesForApplication } from "./UsersAndRoles/api";
import logger from "./utils/logging";
import { domainEventsBackendDaemon } from "./services/domain-events/backend";
import { initUsersAndRoles } from "./UsersAndRoles/init";
import { initDomainEventsService } from "./services/domain-events/init";
import { initDbPersistenceModel } from "./persistence/db/models";

const main = async () => {
  logger.info("Initialising database...");
  await initDbPersistenceModel();

  const program = Effect.gen(function* programGenerator() {
    yield* initDomainEventsService();
    yield* Effect.sync(() => initUsersAndRoles());
    yield* Effect.log("Before setting up domain events backend");
    yield* domainEventsBackendDaemon();
    yield* Effect.log("Finished setting up domain events backend");

    yield* registerRolesForApplication("dlwTest", ["role1", "role2"]);
  });

  Effect.runPromise(program).then(() => console.log("Promise 1 finished"));

  logger.info("Starting app server...");
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    logger.info("App server listening for connections.");
  });
};

main();
