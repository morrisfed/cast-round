import { getEvents as apiGetEvents, getEvent as apiGetEvent } from "api/events";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { Event, EventWithVotes } from "interfaces/event";

let eventsPromise:
  | Promise<E.Either<Error | "forbidden", readonly Event[]>>
  | undefined = undefined;

const eventDetailsPromises: Map<
  string,
  Promise<E.Either<Error | "forbidden", EventWithVotes>>
> = new Map();

export const getEvents = (): TE.TaskEither<
  Error | "forbidden",
  readonly Event[]
> => {
  if (eventsPromise === undefined) {
    const getEventsTask = apiGetEvents();
    eventsPromise = getEventsTask();
  }
  return () => eventsPromise!;
};

export const refreshEvents = (): TE.TaskEither<
  Error | "forbidden",
  readonly Event[]
> => {
  eventsPromise = undefined;
  eventDetailsPromises.clear();
  return getEvents();
};

export const getEvent = (
  eventId: string
): TE.TaskEither<Error | "forbidden", EventWithVotes> => {
  let eventDetailsPromise = eventDetailsPromises.get(eventId);
  if (eventDetailsPromise === undefined) {
    const getEventTask = apiGetEvent(eventId);
    eventDetailsPromise = getEventTask();
    eventDetailsPromises.set(eventId, eventDetailsPromise);
  }

  return () => eventDetailsPromise!;
};

export const refreshEvent = (
  eventId: string
): TE.TaskEither<Error | "forbidden", EventWithVotes> => {
  eventDetailsPromises.delete(eventId);
  return getEvent(eventId);
};
