import { getEvent } from "api/events";
import EventItem from "components/Event/EventItem";
import TabNavLink from "components/TabNavLink";
import * as E from "fp-ts/lib/Either";

import { LoaderFunctionArgs, Outlet, useLoaderData } from "react-router-dom";

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

const Event: React.FC = () => {
  const event = useLoaderData() as Awaited<ReturnType<typeof eventLoader>>;

  return (
    <div>
      <EventItem event={event} showEventDescription={true} />
      <div className="tabs">
        <TabNavLink to="" end>
          Votes
        </TabNavLink>
        <TabNavLink to="newvote" end>
          New vote
        </TabNavLink>
        <TabNavLink to="tellordelegates" end>
          Tellor delegates
        </TabNavLink>
        <TabNavLink to="newtellordelegate" end>
          New tellor delegate
        </TabNavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Event;
