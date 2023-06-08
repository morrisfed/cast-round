import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as ROA from "fp-ts/lib/ReadonlyArray";

import axios, { AxiosError, AxiosResponse } from "axios";
import { EventGroupDelegate } from "interfaces/delegates";

export type DelegateUserType = "group-delegate" | "tellor";

export interface DelegateUserInfo {
  id: string;
  label: string;
  type: DelegateUserType;

  linkForUserId?: string;
  createdByUserId?: string;
}

export interface GetDelegatesResponse {
  accounts: readonly {
    id: string;
    label: string;
    createdBy: { id: string };
    type: DelegateUserType;
  }[];
}

export interface GetEventGroupDelegateResponse {
  delegateUserId: string;
  delegateUserLoginPath: string;
  eventId: number;
  label: string;
  delegateForAccountUserId: string;
}

export interface CreateEventGroupDelegateRequest {
  eventId: number;
  label: string;
  delegateForAccountUserId: string;
}

export interface CreateEventGroupDelegateResponse {
  delegateUserId: string;
  delegateUserLoginUrl: string;
  eventId: number;
  label: string;
  delegateForAccountUserId: string;
}

const retrieveDelegates = (): TE.TaskEither<
  Error | "forbidden",
  readonly DelegateUserInfo[]
> =>
  pipe(
    TE.tryCatch(
      () => axios.get<GetDelegatesResponse>("/api/delegates"),
      (reason: any) =>
        reason.response.status === 403 ? "forbidden" : new Error(`${reason}`)
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.accounts),
    TE.map(
      ROA.map((retAcc) => ({
        ...retAcc,
      }))
    )
  );

export const getEventGroupDelegate = (
  eventId: string
): TE.TaskEither<Error | "not-found", EventGroupDelegate> =>
  pipe(
    TE.tryCatch(
      () =>
        axios.get<GetEventGroupDelegateResponse>(
          "/api/events/" + eventId + "/groupdelegate"
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
    TE.map((response) => response.data),
    TE.map((data) => ({
      delegateUserId: data.delegateUserId,
      eventId: data.eventId,
      label: data.label,
      delegateForAccountUserId: data.delegateForAccountUserId,
      delegateUserLoginUrl: `${window.location.origin}${data.delegateUserLoginPath}`,
    }))
  );

export const createEventGroupDelegate = (
  eventId: number,
  label: string,
  delegateForAccountUserId: string
): TE.TaskEither<Error | "forbidden", EventGroupDelegate> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          CreateEventGroupDelegateResponse,
          AxiosResponse<CreateEventGroupDelegateResponse>,
          CreateEventGroupDelegateRequest
        >(`/api/delegates/eventgroupdelegates`, {
          label,
          eventId,
          delegateForAccountUserId,
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

export const getDelegates = () => pipe(retrieveDelegates());
