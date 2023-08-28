import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

import { ActionFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import { MotionStatus, MotionWithOptionalVotes } from "interfaces/motion";
import MotionDetails from "components/Motion/MotionDetails";
import { eventMotionLoader } from "./EventMotionRoute";
import { setEventMotionStatus } from "events/event-service";
import { MotionVote } from "interfaces/motion-vote";
import { setMotionVotes } from "events/motion-votes-service";
import { UserProfile } from "interfaces/user";
import { useUserProfile } from "components/UserProfileContext";

export async function eventMotionAction(
  profile: UserProfile,
  { params, request }: ActionFunctionArgs
) {
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
      case "proxy":
      case "open":
      case "closed":
      case "cancelled":
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
  } else if (intent === "cast-votes") {
    const votes = JSON.parse(
      formData.get("votesJson") as string
    ) as MotionVote[];

    const onBehalfUserId =
      profile.groupDelegateInfo?.delegateForGroupId ?? profile.id;

    const castVotesTask = setMotionVotes(motionId, onBehalfUserId, votes);
    const castVotesEither = await castVotesTask();
    if (E.isLeft(castVotesEither)) {
      throw castVotesEither.left;
    }
  } else {
    throw new Error("Invalid intent");
  }

  return redirect(`.`);
}

const EventMotionIndexRoute: React.FC = () => {
  const profile = useUserProfile();
  const onBehalfUserId =
    profile.groupDelegateInfo?.delegateForGroupId ?? profile.id;

  const motion: MotionWithOptionalVotes = useLoaderData() as Awaited<
    ReturnType<typeof eventMotionLoader>
  >;

  return <MotionDetails motion={motion} memberId={onBehalfUserId} />;
};

export default EventMotionIndexRoute;
