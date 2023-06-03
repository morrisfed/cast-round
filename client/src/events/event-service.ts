import { getEvents as apiGetEvents, getEvent as apiGetEvent } from "api/events";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { Event, EventWithVotes } from "interfaces/event";
import { pipe } from "fp-ts/lib/function";

let eventsPromise:
  | Promise<E.Either<Error | "forbidden", readonly Event[]>>
  | undefined = undefined;

const eventDetailsPromises: Map<
  string,
  Promise<E.Either<Error | "forbidden", EventWithVotes>>
> = new Map();

const createGetEventsPromise = pipe(apiGetEvents());

export const getEvents = (): TE.TaskEither<
  Error | "forbidden",
  readonly Event[]
> => {
  const localEventsPromise = eventsPromise ?? createGetEventsPromise();

  eventsPromise = localEventsPromise;

  // If there is an error getting events, clear the cached events promise so new calls to getEvents
  // will try to retrieve events again.
  localEventsPromise.then((result) => {
    if (E.isLeft(result)) {
      eventsPromise = undefined;
    }
  });

  return () => localEventsPromise!;
};

export const refreshEvents = (): TE.TaskEither<
  Error | "forbidden",
  readonly Event[]
> => {
  eventsPromise = undefined;
  eventDetailsPromises.clear();
  return getEvents();
};

const createGetEventPromise = (eventId: string) => apiGetEvent(eventId)();

export const getEvent = (
  eventId: string
): TE.TaskEither<Error | "forbidden", EventWithVotes> => {
  const localEventDetailsPromise =
    eventDetailsPromises.get(eventId) ?? createGetEventPromise(eventId);

  eventDetailsPromises.set(eventId, localEventDetailsPromise);

  // Clear the promise from the map if there is a problem retrieving the event details.
  localEventDetailsPromise.then((result) => {
    if (E.isLeft(result)) {
      eventDetailsPromises.delete(eventId);
    }
  });

  return () => localEventDetailsPromise!;
};

export const refreshEvent = (
  eventId: string
): TE.TaskEither<Error | "forbidden", EventWithVotes> => {
  eventDetailsPromises.delete(eventId);
  return getEvent(eventId);
};
