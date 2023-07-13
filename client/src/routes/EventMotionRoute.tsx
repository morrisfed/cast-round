import * as E from "fp-ts/lib/Either";

import { LoaderFunctionArgs } from "react-router-dom";
import { pipe } from "fp-ts/lib/function";
import { getEventMotion } from "api/events";
import { CrumbDataFn } from "components/Crumb";

export async function eventMotionLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const motionId = params.motionId;
  if (!motionId) {
    throw new Error("No motion ID provided");
  }

  const getEventMotionTask = pipe(getEventMotion(eventId, motionId));

  const eventEither = await getEventMotionTask();

  if (E.isLeft(eventEither)) {
    throw eventEither.left;
  }

  return eventEither.right;
}

export const EventMotionCrumb: CrumbDataFn = (match) => {
  const data = match.data as Awaited<ReturnType<typeof eventMotionLoader>>;
  return { label: data.title };
};
