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
import { showEventGroupDelegate } from "profile/functionality";
import {
  createEventGroupDelegate,
  getEventGroupDelegate,
} from "delegates/delegates-service";

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
      ([event, delegate]) => ({
        event,
        delegate,
        showDelegate: true,
      })
    );

    return { eventAndDelegatePromise: combinedPromise };
  } else {
    const combinedPromise = eventPromise.then((event) => ({
      event,
      delegate: O.none,
      showDelegate: false,
    }));
    return { eventAndDelegatePromise: combinedPromise };
  }
}

export async function createEventGroupDelegateAction(
  profile: UserProfile,
  { request, params }: ActionFunctionArgs
) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const formData = await request.formData();
  const label = formData.get("label") as string;

  const createDelegateTask = createEventGroupDelegate(
    eventId,
    label,
    profile.id
  );

  return createDelegateTask();

  // return redirect(`/accounts/${accountId}`);
}

const EventIndexRoute: React.FC = () => {
  const { eventAndDelegatePromise } = useLoaderData() as ReturnType<
    typeof eventIndexLoader
  >;

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Await resolve={eventAndDelegatePromise} errorElement={<LoadingError />}>
        {({ event, delegate, showDelegate }) => (
          <EventView
            event={event}
            showDelegate={showDelegate}
            delegateO={delegate}
          />
        )}
      </Await>
    </React.Suspense>
  );
};

export default EventIndexRoute;
