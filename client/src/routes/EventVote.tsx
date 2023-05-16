import * as E from "fp-ts/lib/Either";

import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { pipe } from "fp-ts/lib/function";
import { getEventVote } from "api/events";
import { Vote } from "interfaces/vote";
import VoteDetails from "components/Vote/VoteDetails";

export async function eventVoteLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const voteId = params.voteId;
  if (!voteId) {
    throw new Error("No vote ID provided");
  }

  const getEventVoteTask = pipe(getEventVote(eventId, voteId));

  const eventEither = await getEventVoteTask();

  if (E.isLeft(eventEither)) {
    throw eventEither.left;
  }

  return eventEither.right;
}

const EventVote: React.FC = () => {
  const vote: Vote = useLoaderData() as Awaited<
    ReturnType<typeof eventVoteLoader>
  >;

  return <VoteDetails vote={vote} />;
};

export default EventVote;
