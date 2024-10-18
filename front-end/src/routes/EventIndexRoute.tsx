import React, { useCallback, useMemo } from "react";
import {
  ActionFunctionArgs,
  Await,
  LoaderFunctionArgs,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";

import EventView from "events/EventView";
import { eventLoader } from "./EventRoute";
import { UserProfile } from "interfaces/user";
import {
  showEventGroupDelegate,
  showEventTellors,
  showEventClerks,
} from "profile/functionality";
import {
  createEventTellor,
  deleteEventTellor,
  getEventTellors,
} from "tellors/tellor-services";
import { refreshEvent } from "events/event-service";
import { useUserProfile } from "components/UserProfileContext";
import {
  createEventClerk,
  deleteEventClerk,
  getEventClerks,
} from "clerks/clerks-services";

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

    const combinedPromise = eventPromise.then((event) => ({
      event,
      showEventGroupDelegate: true,
      eventTellors: [],
      showEventTellors: false,
    }));

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

  if (intent === "create-event-tellor") {
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

  const navigate = useNavigate();
  const location = useLocation();
  const profile = useUserProfile();

  const refreshHandler = useCallback(
    (eventId: number) => {
      refreshEvent("" + eventId);
      navigate(location.pathname, { replace: true });
    },
    [navigate, location]
  );

  const showClerks = useMemo(() => showEventClerks(profile), [profile]);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Await resolve={eventDetailsPromise} errorElement={<LoadingError />}>
        {({
          event,
          showEventGroupDelegate,
          eventTellors,
          showEventTellors,
        }) => (
          <EventView
            event={event}
            showEventGroupDelegate={showEventGroupDelegate}
            showEventTellors={showEventTellors}
            eventTellors={eventTellors}
            showEventClerks={showClerks}
            clerksControllerProps={{
              getClerks: () => getEventClerks(event.id),
              createClerk: (label) => createEventClerk(event.id, label),
              deleteClerk: (clerkId) => deleteEventClerk(event.id, clerkId),
            }}
            refreshHandler={refreshHandler}
          />
        )}
      </Await>
    </React.Suspense>
  );
};

export default EventIndexRoute;
