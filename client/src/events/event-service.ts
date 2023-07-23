import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as IO from "fp-ts/lib/IO";

import {
  getEvents as apiGetEvents,
  getEvent as apiGetEvent,
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  createEventMotion as apiCreateEventMotion,
  updateEventMotion as apiUpdateEventMotion,
} from "api/events";
import { Event, EventUpdates, EventWithMotions } from "interfaces/event";
import { BuildableMotion, Motion, MotionUpdates } from "interfaces/motion";

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
  // If no errors occured, notify listeners that the events have changed.
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
  fromDate: Date,
  toDate: Date
): TE.TaskEither<Error | "forbidden", Event> => {
  return pipe(
    apiCreateEvent(name, description, fromDate, toDate),
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

export const updateEvent = (
  eventId: number | string,
  eventUpdates: EventUpdates
): TE.TaskEither<Error | "forbidden", EventWithMotions> => {
  return pipe(
    apiUpdateEvent(eventId, eventUpdates),
    TE.chain(() => refreshEvent(eventId.toString()))
  );
};

export const createEventMotion = (
  eventId: number | string,
  buildableMotion: BuildableMotion
): TE.TaskEither<Error | "forbidden", Motion> => {
  return pipe(
    apiCreateEventMotion(eventId, buildableMotion),
    TE.tap(() => refreshEvent(eventId.toString()))
  );
};

export const updateEventMotion = (
  eventId: number | string,
  motionId: number | string,
  updates: MotionUpdates
): TE.TaskEither<Error | "forbidden", Motion> => {
  return pipe(
    apiUpdateEventMotion(eventId, motionId, updates),
    TE.tap(() => refreshEvent(eventId.toString()))
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
