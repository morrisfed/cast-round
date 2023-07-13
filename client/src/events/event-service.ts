import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as IO from "fp-ts/lib/IO";

import {
  getEvents as apiGetEvents,
  getEvent as apiGetEvent,
  createEvent as apiCreateEvent,
} from "api/events";
import { Event, EventWithMotions } from "interfaces/event";

export type EventsChangedListener = (events: readonly Event[]) => void;

let events: readonly Event[] = [];

let eventsPromise:
  | Promise<E.Either<Error | "forbidden", readonly Event[]>>
  | undefined = undefined;

const eventDetailsPromises: Map<
  string,
  Promise<E.Either<Error | "forbidden", EventWithMotions>>
> = new Map();

const eventsChangedListeners: EventsChangedListener[] = [];

const createGetEventsPromise = pipe(apiGetEvents());

export const getEvents = (): TE.TaskEither<
  Error | "forbidden",
  readonly Event[]
> => {
  const localEventsPromise = eventsPromise ?? createGetEventsPromise();

  eventsPromise = localEventsPromise;

  // If there is an error getting events, clear the cached events promise so new calls to getEvents
  // will try to retrieve events again.
  // If no errors occured, notifiy listeners that the events have changed.
  localEventsPromise.then((result) => {
    if (E.isLeft(result)) {
      eventsPromise = undefined;
    } else {
      events = result.right;
      notifyEventsChangedListeners(events);
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
  notifyEventsChangedListeners([]);
  return getEvents();
};

const createGetEventPromise = (eventId: string) => apiGetEvent(eventId)();

export const getEvent = (
  eventId: string
): TE.TaskEither<Error | "forbidden", EventWithMotions> => {
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
): TE.TaskEither<Error | "forbidden", EventWithMotions> => {
  eventDetailsPromises.delete(eventId);
  return getEvent(eventId);
};

export const createEvent = (
  name: string,
  description: string,
  fromDateString: string,
  toDateString: string
): TE.TaskEither<Error | "forbidden", Event> => {
  return pipe(
    apiCreateEvent(name, description, fromDateString, toDateString),
    TE.tapIO((event: EventWithMotions) =>
      IO.of(
        eventDetailsPromises.set(
          event.id.toString(),
          Promise.resolve(E.right(event))
        )
      )
    ),
    TE.tap(() => refreshEvents())
  );
};

export const registerEventsChangedListener = (
  listener: EventsChangedListener
): readonly Event[] => {
  eventsChangedListeners.push(listener);

  return events;
};

const notifyEventsChangedListeners = (events: readonly Event[]) => {
  eventsChangedListeners.forEach((listener) => listener(events));
};
