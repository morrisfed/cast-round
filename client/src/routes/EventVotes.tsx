import * as E from "fp-ts/lib/Either";

import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
import { pipe } from "fp-ts/lib/function";
import { getEventVotes } from "api/events";
import VoteList from "components/Vote/VoteList";

export async function eventVotesLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const getEventVotesTask = pipe(getEventVotes(eventId));

  const eventEither = await getEventVotesTask();

  if (E.isLeft(eventEither)) {
    throw eventEither.left;
  }

  return eventEither.right;
}

const EventVotes: React.FC = () => {
  const votes = useLoaderData() as Awaited<ReturnType<typeof eventVotesLoader>>;
  const params = useParams<Record<"eventId", string>>();

  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  return (
    <VoteList eventId={eventId} votes={votes} showVoteDescription={false} />
  );
};

export default EventVotes;
