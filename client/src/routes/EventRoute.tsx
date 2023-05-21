import { getEvent } from "api/events";
import { CrumbDataFn } from "components/Crumb";
import * as E from "fp-ts/lib/Either";

import { LoaderFunctionArgs } from "react-router-dom";

export async function eventLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const getEventTask = getEvent(eventId);

  const eventEither = await getEventTask();

  if (E.isLeft(eventEither)) {
    throw eventEither.left;
  }

  return eventEither.right;
}

export const EventCrumb: CrumbDataFn = (match) => {
  const data = match.data as Awaited<ReturnType<typeof eventLoader>>;
  return { label: data.name };
};
