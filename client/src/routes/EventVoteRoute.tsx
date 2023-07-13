import * as E from "fp-ts/lib/Either";

import { LoaderFunctionArgs } from "react-router-dom";
import { pipe } from "fp-ts/lib/function";
import { getEventMotion } from "api/events";
import { CrumbDataFn } from "components/Crumb";

export async function eventVoteLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const voteId = params.voteId;
  if (!voteId) {
    throw new Error("No vote ID provided");
  }

  const getEventVoteTask = pipe(getEventMotion(eventId, voteId));

  const eventEither = await getEventVoteTask();

  if (E.isLeft(eventEither)) {
    throw eventEither.left;
  }

  return eventEither.right;
}

export const EventVoteCrumb: CrumbDataFn = (match) => {
  const data = match.data as Awaited<ReturnType<typeof eventVoteLoader>>;
  return { label: data.title };
};
