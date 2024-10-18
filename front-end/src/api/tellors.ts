import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as ROA from "fp-ts/lib/ReadonlyArray";

import axios, { AxiosError, AxiosResponse } from "axios";
import { EventTellor } from "interfaces/tellors";

interface EventTellorResponse {
  tellorUserId: string;
  tellorUserLoginPath: string;
  eventId: number;
  label: string;
}

export interface GetEventTellorsResponse {
  tellors: readonly EventTellorResponse[];
}

export interface CreateEventTellorRequest {
  eventId: number;
  label: string;
}

export interface CreateEventTellorResponse {
  tellorUserId: string;
  tellorUserLoginPath: string;
  eventId: number;
  label: string;
}

export const getEventTellors = (
  eventId: string
): TE.TaskEither<Error | "not-found", readonly EventTellor[]> =>
  pipe(
    TE.tryCatch(
      () =>
        axios.get<GetEventTellorsResponse>(
          "/api/events/" + eventId + "/tellors"
        ),
      (reason: any) => {
        switch (reason?.response?.status) {
          case 404:
            return "not-found" as const;

          default:
            return new Error(`${reason}`);
        }
      }
    ),
    TE.map((response) => response.data.tellors),
    TE.map(
      ROA.map((tellorResponse) => ({
        tellorUserId: tellorResponse.tellorUserId,
        tellorUserLoginUrl: `${window.location.origin}${tellorResponse.tellorUserLoginPath}`,
        eventId: tellorResponse.eventId,
        label: tellorResponse.label,
      }))
    )
  );

export const createEventTellor = (
  eventId: number,
  label: string
): TE.TaskEither<Error | "forbidden", EventTellor> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          CreateEventTellorResponse,
          AxiosResponse<CreateEventTellorResponse>,
          CreateEventTellorRequest
        >(`/api/tellors`, {
          label,
          eventId,
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
    TE.map((tellorResponse) => ({
      tellorUserId: tellorResponse.tellorUserId,
      tellorUserLoginUrl: `${window.location.origin}${tellorResponse.tellorUserLoginPath}`,
      eventId: tellorResponse.eventId,
      label: tellorResponse.label,
    }))
  );
};

export const deleteEventTellor = (
  eventId: number,
  tellorUserId: string
): TE.TaskEither<Error | "forbidden" | "not-found", unknown> =>
  pipe(
    TE.tryCatch(
      () => axios.delete("/api/events/" + eventId + "/tellors/" + tellorUserId),
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
