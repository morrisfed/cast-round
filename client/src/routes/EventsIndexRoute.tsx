import React from "react";

import * as E from "fp-ts/lib/Either";

import { useLoaderData } from "react-router-dom";
import { getEvents } from "api/events";
import EventsIndexView from "events/EventsIndexView";

export async function eventsLoader() {
  const getEventsTask = getEvents();

  const eventsEither = await getEventsTask();

  if (E.isLeft(eventsEither)) {
    throw eventsEither.left;
  }

  return eventsEither.right;
}

const EventsIndexRoute: React.FC = () => {
  const events = useLoaderData() as Awaited<ReturnType<typeof eventsLoader>>;

  return <EventsIndexView events={events} />;
};

export default EventsIndexRoute;
