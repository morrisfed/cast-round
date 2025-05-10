import { Array, Effect, Option } from "effect";
import { Void } from "effect/Schema";
import { PublishedDomainEvent } from "../../persistence/db/models/DomainEvent";
import { SequelizeTransaction } from "../../persistence/db/SequelizeTransaction";
import { DomainEvent } from "./event";

let subscribers: Array<Subscriber> = Array.empty();

export interface Subscriber {
  subscriberId: string;
  eventNames: string[];
  callback: (
    event: PublishedDomainEvent
  ) => Effect.Effect<unknown, never, SequelizeTransaction>;
}

export const getEventSubscribers = (event: DomainEvent) => {
  const eventName = event._tag;
  const eventSubscribers = subscribers.filter((subscriber) =>
    subscriber.eventNames.includes(eventName)
  );
  return eventSubscribers;
};

const getSubscriber = (subscriberId: string) =>
  Option.fromNullable(
    subscribers.find((subscriber) => subscriber.subscriberId === subscriberId)
  );

export const offerEventToSubscriber = (domainEvent: PublishedDomainEvent) =>
  getSubscriber(domainEvent.subscriberId).pipe(
    Effect.andThen((subscriber) => subscriber.callback(domainEvent))
  );

export const subscribeToDomainEvents =
  (subscriberId: string) =>
  (eventNames: string[]) =>
  (
    callback: (
      event: PublishedDomainEvent
    ) => Effect.Effect<unknown, never, never>
  ) => {
    subscribers = Array.append(subscribers, {
      subscriberId,
      eventNames,
      callback,
    } as Subscriber);
    return Effect.succeed(Void);
  };
