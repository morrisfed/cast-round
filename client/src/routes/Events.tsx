import React from "react";

import * as E from "fp-ts/lib/Either";

import { Link, NavLink, useLoaderData } from "react-router-dom";
import { getEvents } from "api/events";
import EventTable from "components/Event/EventTable";

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
      <EventTable events={events} />
    </div>
  );
};

export default Events;
