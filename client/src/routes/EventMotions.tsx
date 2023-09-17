import * as E from "fp-ts/lib/Either";

import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
import { pipe } from "fp-ts/lib/function";
import { getEventMotions } from "api/events";
import MotionList from "components/Motion/MotionList";

export async function eventMotionsLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const getEventMotionsTask = pipe(getEventMotions(eventId));

  const eventEither = await getEventMotionsTask();

  if (E.isLeft(eventEither)) {
    throw eventEither.left;
  }

  return eventEither.right;
}

const EventMotions: React.FC = () => {
  const motions = useLoaderData() as Awaited<
    ReturnType<typeof eventMotionsLoader>
  >;
  const params = useParams<Record<"eventId", string>>();

  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  return <MotionList motions={motions} />;
};

export default EventMotions;
