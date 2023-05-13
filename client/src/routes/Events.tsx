import React from "react";

import * as E from "fp-ts/lib/Either";

import { Link, useLoaderData } from "react-router-dom";
import { getEvents } from "api/events";
import EventList from "components/Event/EventList";

export async function eventsLoader() {
  const getEventsTask = getEvents();

  const eventsEither = await getEventsTask();

  if (E.isLeft(eventsEither)) {
    throw eventsEither.left;
  }

  return eventsEither.right;
}

const Events: React.FC = () => {
  const events = useLoaderData() as Awaited<ReturnType<typeof eventsLoader>>;

  return (
    <div className="flex flex-col gap-2 p-2">
      <Link to="newevent" className="btn-primary btn">
        New event
      </Link>
      <EventList events={events} showEventDescription={false} />
    </div>
  );
};

export default Events;
