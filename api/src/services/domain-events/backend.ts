import { Effect, Option, Queue } from "effect";
import { Transaction } from "sequelize";
import { SequelizeTransaction } from "../../persistence/db/SequelizeTransaction";
import { PublishedDomainEvent } from "../../persistence/db/models/DomainEvent";
import { wrapWithTransaction } from "../../persistence/db/transaction";
import { offerEventToSubscriber } from "./subscriptions";

const publishedEventsNotificationQueue = Effect.runSync(
  Queue.unbounded<number>()
);

export const notifyDomainEventPublished = () =>
  Queue.offer(publishedEventsNotificationQueue, 1).pipe(
    Effect.tap(Effect.log("Notified domain event published"))
  );

const getNextPublishedDomainEvents = (transaction: Transaction) =>
  Effect.tryPromise(() => PublishedDomainEvent.findOne({ transaction })).pipe(
    Effect.andThen(Option.fromNullable)
  );

const processDomainEvent = (domainEvent: PublishedDomainEvent) =>
  offerEventToSubscriber(domainEvent);

const removeProcessedPublishedDomainEvent =
  (transaction: Transaction) => (domainEvent: PublishedDomainEvent) =>
    Effect.tryPromise(() => domainEvent.destroy({ transaction }));

const getAndProcessNextDomainEvent = () =>
  SequelizeTransaction.pipe(
    Effect.andThen((transaction) =>
      getNextPublishedDomainEvents(transaction).pipe(
        Effect.tap(processDomainEvent),
        Effect.andThen(removeProcessedPublishedDomainEvent(transaction))
      )
    )
  );

// Loop which takes and item from the queue and prints out a timestamp.
// Fork into a new fiber.
const queueRunner = () =>
  Queue.take(publishedEventsNotificationQueue).pipe(
    Effect.tap((item) => Effect.log(`Queue item: ${item}`)),
    Effect.andThen(() => wrapWithTransaction(getAndProcessNextDomainEvent())),
    Effect.forever
  );

// Effect which forks a the backend domain events service.
export const domainEventsBackendDaemon = () =>
  Effect.gen(function* domainEventsBackendDaemonGenerator() {
    yield* Effect.forkDaemon(queueRunner());
  });
