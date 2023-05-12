import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios, { AxiosError, AxiosResponse } from "axios";

import { Event } from "interfaces/event";

interface GetEventsResponse {
  events: Event[];
}

interface GetEventResponse {
  event: Event;
}

interface CreateEventRequest {
  event: Omit<Event, "id" | "fromDate" | "toDate"> & {
    fromDate: string;
    toDate: string;
  };
}

interface CreateEventResponse {
  event: Event;
}

const retrieveEvents = (): TE.TaskEither<
  Error | "forbidden",
  readonly Event[]
> =>
  pipe(
    TE.tryCatch(
      () => axios.get<GetEventsResponse>("/api/events"),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.events)
  );

export const getEvents = () => pipe(retrieveEvents());

const retrieveEvent = (
  id: number | string
): TE.TaskEither<Error | "forbidden", Event> =>
  pipe(
    TE.tryCatch(
      () => axios.get<GetEventResponse>("/api/events/" + id),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          } else if (error.response.status === 404) {
            return new Error("Event not found");
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.event)
  );

export const getEvent = (id: number | string) => pipe(retrieveEvent(id));

export const createEvent = (
  name: string,
  description: string,
  fromDateString: string,
  toDateString: string
): TE.TaskEither<Error | "forbidden", Event> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          CreateEventResponse,
          AxiosResponse<CreateEventResponse>,
          CreateEventRequest
        >(`/api/events`, {
          event: {
            name,
            description,
            fromDate: fromDateString,
            toDate: toDateString,
          },
        }),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.event)
  );
};
