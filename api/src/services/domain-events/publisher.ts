import { Effect } from "effect";
import { SequelizeTransaction } from "../../persistence/db/SequelizeTransaction";
import { PublishedDomainEvent } from "../../persistence/db/models/DomainEvent";
import { getEventSubscribers } from "./subscriptions";
import { DomainEvent } from "./event";

export const publishDomainEvent = (event: DomainEvent) =>
  Effect.forEach(getEventSubscribers(event), (subscriber) =>
    SequelizeTransaction.pipe(
      Effect.tap(() => Effect.log(`Publishing event: ${event._tag}`)),
      Effect.andThen((transaction) =>
        Effect.tryPromise(() =>
          PublishedDomainEvent.create(
            {
              _tag: event._tag,
              subscriberId: subscriber.subscriberId,
              eventJson: JSON.stringify(event),
            },
            {
              transaction,
            }
          )
        )
      )
    )
  );
