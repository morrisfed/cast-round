import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as ROA from "fp-ts/lib/ReadonlyArray";

import axios, { AxiosError, AxiosResponse } from "axios";

import { EventClerk } from "interfaces/clerks";

interface EventClerkResponse {
  clerkUserId: string;
  clerkUserLoginPath: string;
  eventId: number;
  label: string;
}

export interface GetEventClerksResponse {
  clerks: readonly EventClerkResponse[];
}

export interface CreateEventClerkRequest {
  eventId: number;
  label: string;
}

export interface CreateEventClerkResponse {
  clerkUserId: string;
  clerkUserLoginPath: string;
  eventId: number;
  label: string;
}

export const getEventClerks = (
  eventId: string
): TE.TaskEither<Error | "not-found", readonly EventClerk[]> =>
  pipe(
    TE.tryCatch(
      () => axios.get<GetEventClerksResponse>(`/api/events/${eventId}/clerks`),
      (reason: any) => {
        switch (reason?.response?.status) {
          case 404:
            return "not-found" as const;

          default:
            return new Error(`${reason}`);
        }
      }
    ),
    TE.map((response) => response.data.clerks),
    TE.map(
      ROA.map((clerkResponse) => ({
        clerkUserId: clerkResponse.clerkUserId,
        clerkUserLoginUrl: `${window.location.origin}${clerkResponse.clerkUserLoginPath}`,
        eventId: clerkResponse.eventId,
        label: clerkResponse.label,
      }))
    )
  );

export const createEventClerk = (
  eventId: number,
  label: string
): TE.TaskEither<Error | "forbidden" | "not-found", EventClerk> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          CreateEventClerkResponse,
          AxiosResponse<CreateEventClerkResponse>,
          CreateEventClerkRequest
        >(`/api/events/${eventId}/clerks`, {
          label,
          eventId,
        }),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          } else if (error.response.status === 404) {
            return "not-found";
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((clerkResponse) => ({
      clerkUserId: clerkResponse.clerkUserId,
      clerkUserLoginUrl: `${window.location.origin}${clerkResponse.clerkUserLoginPath}`,
      eventId: clerkResponse.eventId,
      label: clerkResponse.label,
    }))
  );
};

export const deleteEventClerk = (
  eventId: number,
  clerkUserId: string
): TE.TaskEither<Error | "forbidden" | "not-found", unknown> =>
  pipe(
    TE.tryCatch(
      () => axios.delete(`/api/events/${eventId}/clerks/${clerkUserId}`),
      (reason: any) => {
        switch (reason?.response?.status) {
          case 403:
            return "forbidden" as const;

          case 404:
            return "not-found" as const;

          default:
            return new Error(`${reason}`);
        }
      }
    )
  );
