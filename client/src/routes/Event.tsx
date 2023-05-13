import { getEvent } from "api/events";
import EventItem from "components/Event/EventItem";
import * as E from "fp-ts/lib/Either";

import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";

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

const Event: React.FC = () => {
  const event = useLoaderData() as Awaited<ReturnType<typeof eventLoader>>;

  return <EventItem event={event} showEventDescription={true} />;
};

export default Event;
