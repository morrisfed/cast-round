import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios, { AxiosError, AxiosResponse } from "axios";

interface EventTellor {
  tellorUserId: string;
  tellorUserLoginUrl: string;
  eventId: number;
  label: string;
}

export interface GetEventTellorsResponse {
  tellors: readonly EventTellor[];
}

export interface CreateEventTellorRequest {
  eventId: number;
  label: string;
}

export interface CreateEventTellorResponse {
  tellorUserId: string;
  tellorUserLoginUrl: string;
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
    TE.map((response) => response.data.tellors)
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
    TE.map((response) => response.data)
  );
};
