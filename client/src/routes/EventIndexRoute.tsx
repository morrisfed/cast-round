import { getEvent } from "api/events";
import EventView from "events/EventView";
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

const EventIndexRoute: React.FC = () => {
  const event = useLoaderData() as Awaited<ReturnType<typeof eventLoader>>;

  return <EventView event={event} />;
};

export default EventIndexRoute;
