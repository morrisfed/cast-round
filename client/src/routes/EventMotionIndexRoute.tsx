import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

import { ActionFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import { Motion, MotionStatus } from "interfaces/motion";
import MotionDetails from "components/Motion/MotionDetails";
import { eventMotionLoader } from "./EventMotionRoute";
import { setEventMotionStatus } from "events/event-service";

export async function eventMotionAction({
  params,
  request,
}: ActionFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const motionId = params.motionId;
  if (!motionId) {
    throw new Error("No motion ID provided");
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "change-status") {
    const motionStatus = formData.get("motionStatus") as MotionStatus;

    let setMotionStatusTask:
      | TE.TaskEither<Error | "forbidden", MotionStatus>
      | undefined;
    switch (motionStatus) {
      case "discarded":
        setMotionStatusTask = setEventMotionStatus(
          eventId,
          motionId,
          motionStatus
        );
        break;
    }

    if (setMotionStatusTask !== undefined) {
      const motionEither = await setMotionStatusTask();
      if (E.isLeft(motionEither)) {
        throw motionEither.left;
      }
    }
  } else {
    throw new Error("Invalid intent");
  }

  return redirect(`.`);
}

const EventMotionIndexRoute: React.FC = () => {
  const motion: Motion = useLoaderData() as Awaited<
    ReturnType<typeof eventMotionLoader>
  >;

  return <MotionDetails motion={motion} />;
};

export default EventMotionIndexRoute;
