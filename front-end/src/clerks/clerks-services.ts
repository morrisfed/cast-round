import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { EventClerk } from "interfaces/clerks";

import {
  getEventClerks as apiGetEventClerks,
  createEventClerk as apiCreateEventClerk,
  deleteEventClerk as apiDeleteEventClerk,
} from "api/clerks";

export const getEventClerks = (
  eventId: string
): TE.TaskEither<Error | "not-found", readonly EventClerk[]> => {
  return apiGetEventClerks(eventId);
};

export const createEventClerk = (
  eventId: number,
  label: string
): TE.TaskEither<Error | "forbidden" | "not-found", EventClerk> => {
  return pipe(apiCreateEventClerk(eventId, label));
};

export const deleteEventClerk = (
  eventId: number,
  clerkUserId: string
): TE.TaskEither<Error | "forbidden" | "not-found", unknown> => {
  return pipe(apiDeleteEventClerk(eventId, clerkUserId));
};
