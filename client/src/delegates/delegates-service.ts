import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import {
  getEventGroupDelegate as apiGetEventGroupDelegate,
  createEventGroupDelegate as apiCreateEventGroupDelegate,
} from "api/delegates";
import { EventGroupDelegate } from "interfaces/delegates";

export const getEventGroupDelegate = (
  eventId: string
): TE.TaskEither<Error | "not-found", EventGroupDelegate> => {
  return apiGetEventGroupDelegate(eventId);
};

export const createEventGroupDelegate = (
  eventId: number,
  label: string,
  delegateForAccountUserId: string
): TE.TaskEither<Error | "forbidden", EventGroupDelegate> => {
  return pipe(
    apiCreateEventGroupDelegate(eventId, label, delegateForAccountUserId)
  );
};
