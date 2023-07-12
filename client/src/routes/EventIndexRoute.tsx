import React from "react";
import {
  ActionFunctionArgs,
  Await,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";

import EventView from "events/EventView";
import { eventLoader } from "./EventRoute";
import { UserProfile } from "interfaces/user";
import {
  showEventGroupDelegate,
  showEventTellors,
} from "profile/functionality";
import {
  createEventGroupDelegate,
  getEventGroupDelegate,
} from "delegates/delegates-service";
import {
  createEventTellor,
  deleteEventTellor,
  getEventTellors,
} from "tellors/tellor-services";

function LoadingError() {
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>Please try tapping the refresh button or reloading the page.</p>
    </div>
  );
}

export function eventIndexLoader(
  profile: UserProfile,
  args: LoaderFunctionArgs
) {
  const eventPromise = eventLoader(args);

  if (showEventGroupDelegate(profile)) {
    const eventId = args.params.eventId;
    if (!eventId) {
      throw new Error("No event ID provided");
    }

    const delegatePromise = getEventGroupDelegate(eventId)().then(
      (delegateEither) => {
        if (E.isLeft(delegateEither)) {
          if (delegateEither.left === "not-found") {
            return O.none;
          } else {
            throw delegateEither.left;
          }
        }
        return O.of(delegateEither.right);
      }
    );

    const combinedPromise = Promise.all([eventPromise, delegatePromise]).then(
      ([event, eventGroupDelegate]) => ({
        event,
        eventGroupDelegate: eventGroupDelegate,
        showEventGroupDelegate: true,
        eventTellors: [],
        showEventTellors: false,
      })
    );

    return { eventDetailsPromise: combinedPromise };
  }
  if (showEventTellors(profile)) {
    const eventId = args.params.eventId;
    if (!eventId) {
      throw new Error("No event ID provided");
    }

    const tellorsPromise = getEventTellors(eventId)().then((tellorsEither) => {
      if (E.isLeft(tellorsEither)) {
        if (tellorsEither.left === "not-found") {
          return [];
        } else {
          throw tellorsEither.left;
        }
      }
      return tellorsEither.right;
    });

    const combinedPromise = Promise.all([eventPromise, tellorsPromise]).then(
      ([event, tellors]) => ({
        event,
        eventTellors: tellors,
        showEventTellors: true,
        eventGroupDelegate: O.none,
        showEventGroupDelegate: false,
      })
    );

    return { eventDetailsPromise: combinedPromise };
  } else {
    const combinedPromise = eventPromise.then((event) => ({
      event,
      eventGroupDelegate: O.none,
      showEventGroupDelegate: false,
      eventTellors: [],
      showEventTellors: false,
    }));
    return { eventDetailsPromise: combinedPromise };
  }
}

export async function createEventUserAction(
  profile: UserProfile,
  { request, params }: ActionFunctionArgs
) {
  const eventIdStr = params.eventId;
  if (!eventIdStr) {
    throw new Error("No event ID provided");
  }

  const eventId = parseInt(eventIdStr, 10);
  if (isNaN(eventId)) {
    throw new Error("Invalid event ID");
  }

  const formData = await request.formData();
  const intent = formData.get("intent");
  const label = formData.get("label") as string;

  let eventTask;

  if (intent === "create-event-group-delegate") {
    eventTask = createEventGroupDelegate(eventId, label, profile.id);
  } else if (intent === "create-event-tellor") {
    eventTask = createEventTellor(eventId, label);
  } else if (intent === "delete-event-tellor") {
    const tellorUserIdStr = formData.get("tellorUserId") as string;
    eventTask = deleteEventTellor(eventId, tellorUserIdStr);
  } else {
    throw new Error("Invalid intent");
  }

  return eventTask();
}

const EventIndexRoute: React.FC = () => {
  const { eventDetailsPromise } = useLoaderData() as ReturnType<
    typeof eventIndexLoader
  >;

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Await resolve={eventDetailsPromise} errorElement={<LoadingError />}>
        {({
          event,
          eventGroupDelegate,
          showEventGroupDelegate,
          eventTellors,
          showEventTellors,
        }) => (
          <EventView
            event={event}
            showEventGroupDelegate={showEventGroupDelegate}
            eventGroupDelegateO={eventGroupDelegate}
            showEventTellors={showEventTellors}
            eventTellors={eventTellors}
          />
        )}
      </Await>
    </React.Suspense>
  );
};

export default EventIndexRoute;
