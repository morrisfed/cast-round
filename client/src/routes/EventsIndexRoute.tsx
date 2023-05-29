import React, { useCallback } from "react";

import * as E from "fp-ts/lib/Either";

import {
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import EventsIndexView from "events/EventsIndexView";
import { getEvents, refreshEvents } from "events/event-service";

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
  const navigate = useNavigate();
  const location = useLocation();

  const refreshHandler = useCallback(() => {
    refreshEvents();
    navigate(location.pathname, { replace: true });
  }, [navigate, location]);

  return (
    <div>
      <EventsIndexView events={events} refreshHandler={refreshHandler} />
    </div>
  );
};

export default EventsIndexRoute;
