import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios, { AxiosError, AxiosResponse } from "axios";

import { Event, EventWithMotions } from "interfaces/event";
import { BuildableMotion, Motion, MotionUpdates } from "interfaces/motion";

interface GetEventsResponse {
  events: Event[];
}

interface GetEventResponse {
  event: EventWithMotions;
}

interface GetEventMotionsResponse {
  motions: Motion[];
}

interface GetEventMotionResponse {
  motion: Motion;
}

interface CreateEventRequest {
  event: Omit<Event, "id" | "fromDate" | "toDate"> & {
    fromDate: string;
    toDate: string;
  };
}

interface CreateEventResponse {
  event: EventWithMotions;
}

interface CreateEventMotionRequest {
  motion: BuildableMotion;
}

interface CreateEventMotionResponse {
  motion: Motion;
}

interface UpdateEventMotionRequest {
  motionUpdates: MotionUpdates;
}

interface UpdateEventMotionResponse {
  motion: Motion;
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
): TE.TaskEither<Error | "forbidden", EventWithMotions> =>
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
): TE.TaskEither<Error | "forbidden", EventWithMotions> => {
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

const retrieveEventMotions = (
  id: number | string
): TE.TaskEither<Error | "forbidden", Motion[]> =>
  pipe(
    TE.tryCatch(
      () =>
        axios.get<GetEventMotionsResponse>("/api/events/" + id + "/motions"),
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
    TE.map((data) => data.motions)
  );

export const getEventMotions = (id: number | string) =>
  pipe(retrieveEventMotions(id));

const retrieveEventMotion = (
  eventId: number | string,
  motionId: number | string
): TE.TaskEither<Error | "forbidden", Motion> =>
  pipe(
    TE.tryCatch(
      () =>
        axios.get<GetEventMotionResponse>(
          "/api/events/" + eventId + "/motions/" + motionId
        ),
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
    TE.map((data) => data.motion)
  );

export const getEventMotion = (
  eventId: number | string,
  motionId: number | string
) => pipe(retrieveEventMotion(eventId, motionId));

export const createEventMotion = (
  eventId: number | string,
  buildableMotion: BuildableMotion
): TE.TaskEither<Error | "forbidden", Motion> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          CreateEventMotionResponse,
          AxiosResponse<CreateEventMotionResponse>,
          CreateEventMotionRequest
        >(`/api/events/${eventId}/motions`, {
          motion: buildableMotion,
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
    TE.map((data) => data.motion)
  );
};

export const updateEventMotion = (
  eventId: number | string,
  motionId: number | string,
  updates: MotionUpdates
): TE.TaskEither<Error | "forbidden", Motion> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.patch<
          UpdateEventMotionResponse,
          AxiosResponse<UpdateEventMotionResponse>,
          UpdateEventMotionRequest
        >(`/api/events/${eventId}/motions/${motionId}`, {
          motionUpdates: updates,
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
    TE.map((data) => data.motion)
  );
};
