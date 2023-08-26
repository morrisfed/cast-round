import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";

import axios, { AxiosError, AxiosResponse } from "axios";

import { Event, EventUpdates, EventWithMotions } from "interfaces/event";
import {
  BuildableMotion,
  Motion,
  MotionStatus,
  MotionUpdates,
  MotionWithOptionalVotes,
} from "interfaces/motion";
import { Role } from "interfaces/user";

export type MotionStatusResponse =
  | "draft"
  | "proxy"
  | "open"
  | "closed"
  | "cancelled"
  | "discarded";

interface RoleVotesDefinitionResponse {
  role: Role;
  votes: number;
}

interface ResponseDefinitionResponse {
  sequence: number;
  code: string;
  label: string;
}

interface VoteDefinitionResponseSchema1 {
  definitionSchemaVersion: 1;
  roleVotes: RoleVotesDefinitionResponse[];
  responses: ResponseDefinitionResponse[];
}
type VoteDefinitionResponse = VoteDefinitionResponseSchema1;

interface MotionVote {
  responseCode: string;
  votes: number;
}

interface MotionResponse {
  id: number;
  status: MotionStatusResponse;
  title: string;
  description: string;
  voteDefinition: VoteDefinitionResponse;
  votes?: MotionVote[];
}

interface EventResponse {
  id: number;
  name: string;
  description: string;
  fromDate: string;
  toDate: string;
}

interface EventWithMotionsResponse extends EventResponse {
  motions: MotionResponse[];
}

interface GetEventsResponse {
  events: EventResponse[];
}

interface GetEventResponse {
  event: EventWithMotionsResponse;
}

interface GetEventMotionsResponse {
  motions: MotionResponse[];
}

interface GetEventMotionResponse {
  motion: MotionResponse;
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

interface UpdateEventRequest {
  eventUpdates: EventUpdates;
}

interface UpdateEventResponse {
  event: Event;
}

interface CreateEventMotionRequest {
  motion: BuildableMotion;
}

interface CreateEventMotionResponse {
  motion: MotionResponse;
}

interface UpdateEventMotionRequest {
  motionUpdates: MotionUpdates;
}

interface UpdateEventMotionResponse {
  motion: MotionResponse;
}

interface SetMotionStatusRequest {
  status: MotionStatus;
}

interface SetMotionStatusResponse {
  status: MotionStatus;
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
    TE.map((data) => data.events),
    TE.map(
      A.map((event) => ({
        ...event,
        fromDate: new Date(event.fromDate),
        toDate: new Date(event.toDate),
      }))
    )
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
    TE.map((data) => data.event),
    TE.map((event) => ({
      ...event,
      fromDate: new Date(event.fromDate),
      toDate: new Date(event.toDate),
    }))
  );

export const getEvent = (id: number | string) => pipe(retrieveEvent(id));

export const createEvent = (
  name: string,
  description: string,
  fromDate: Date,
  toDate: Date
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
            fromDate: fromDate.toISOString(),
            toDate: toDate.toISOString(),
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

export const updateEvent = (
  eventId: number | string,
  eventUpdates: EventUpdates
): TE.TaskEither<Error | "forbidden", Event> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.patch<
          UpdateEventResponse,
          AxiosResponse<UpdateEventResponse>,
          UpdateEventRequest
        >(`/api/events/${eventId}`, {
          eventUpdates,
        }),
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
): TE.TaskEither<Error | "forbidden", MotionWithOptionalVotes> =>
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

export const setEventMotionStatus = (
  eventId: number | string,
  motionId: number | string,
  status: MotionStatus
): TE.TaskEither<Error | "forbidden", MotionStatus> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          SetMotionStatusResponse,
          AxiosResponse<SetMotionStatusResponse>,
          SetMotionStatusRequest
        >(`/api/events/${eventId}/motions/${motionId}/status`, {
          status,
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
    TE.map((data) => data.status)
  );
};
