import React, { useCallback } from "react";

import * as E from "fp-ts/lib/Either";

import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import EventsIndexView from "events/EventsIndexView";
import { getEvents, refreshEvents } from "events/event-service";

export function eventsLoader() {
  const getEventsTask = getEvents();

  const eventsPromise = getEventsTask().then((eventsEither) => {
    if (E.isLeft(eventsEither)) {
      throw eventsEither.left;
    }

    return eventsEither.right;
  });

  return { eventsPromise };
}

const EventsIndexRoute: React.FC = () => {
  const data = useLoaderData() as ReturnType<typeof eventsLoader>;
  const navigate = useNavigate();
  const location = useLocation();

  const refreshHandler = useCallback(() => {
    refreshEvents();
    navigate(location.pathname, { replace: true });
  }, [navigate, location]);

  return (
    <div>
      <EventsIndexView
        eventsPromise={data.eventsPromise}
        newEventLinkToPath="new"
        refreshHandler={refreshHandler}
      />
    </div>
  );
};

export default EventsIndexRoute;
