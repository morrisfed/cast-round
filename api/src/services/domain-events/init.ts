import { Effect } from "effect";
import { PublishedDomainEvent } from "../../persistence/db/models/DomainEvent";
import { notifyDomainEventPublished } from "./backend";

export const initDomainEventsService = () =>
  Effect.sync(() =>
    PublishedDomainEvent.afterSave((instance, options) => {
      if (options.transaction) {
        options.transaction.afterCommit(() => {
          Effect.runFork(notifyDomainEventPublished());
        });
      }
    })
  ).pipe(
    Effect.andThen(
      Effect.sync(() =>
        PublishedDomainEvent.afterDestroy((instance, options) => {
          if (options.transaction) {
            options.transaction.afterCommit(() => {
              Effect.runFork(notifyDomainEventPublished());
            });
          }
        })
      )
    )
  );
