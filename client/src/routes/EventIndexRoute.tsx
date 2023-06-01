import React from "react";
import { Await, LoaderFunctionArgs, useLoaderData } from "react-router-dom";

import EventView from "events/EventView";
import { eventLoader } from "./EventRoute";

function LoadingError() {
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>Please try tapping the refresh button or reloading the page.</p>
    </div>
  );
}

export function eventIndexLoader(args: LoaderFunctionArgs) {
  const eventPromise = eventLoader(args);
  return { eventPromise };
}

const EventIndexRoute: React.FC = () => {
  const { eventPromise } = useLoaderData() as ReturnType<
    typeof eventIndexLoader
  >;

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Await resolve={eventPromise} errorElement={<LoadingError />}>
        {(event) => <EventView event={event} />}
      </Await>
    </React.Suspense>
  );
};

export default EventIndexRoute;
