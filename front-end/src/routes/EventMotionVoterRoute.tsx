import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { apply } from "fp-ts";

import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { getEventMotion } from "api/events";
import { getVoterById } from "events/motion-voters-service";
import MotionDetailsView from "components/Motion/MotionDetailsView";
import AccountItem from "components/Account/AccountItem";
import MotionVoteController from "components/Motion/MotionVoteController";

export async function eventMotionVoterLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const motionId = params.motionId;
  if (!motionId) {
    throw new Error("No motion ID provided");
  }

  const voterId = params.voterId;
  if (!voterId) {
    throw new Error("No voter ID provided");
  }

  const getEventMotionTask = pipe(getEventMotion(eventId, motionId));
  const getVoterTask = getVoterById(voterId);
  const tasks = apply.sequenceT(TE.ApplyPar)(getEventMotionTask, getVoterTask);

  const motionVoterEither = await tasks();

  if (E.isLeft(motionVoterEither)) {
    throw motionVoterEither.left;
  }

  if (O.isNone(motionVoterEither.right[1])) {
    throw new Error("Voter not found");
  }

  return [
    motionVoterEither.right[0],
    motionVoterEither.right[1].value,
  ] as const;
}

const EventMotionVoterRoute: React.FC = () => {
  const [eventMotion, voter] = useLoaderData() as Awaited<
    ReturnType<typeof eventMotionVoterLoader>
  >;

  return (
    <div className="flex flex-col gap-2">
      <MotionDetailsView motion={eventMotion} />

      <AccountItem account={voter} linkPathPrefix="../" />

      <MotionVoteController
        motion={eventMotion}
        memberId={voter.id}
        roles={voter.roles}
      />
    </div>
  );
};

export default EventMotionVoterRoute;
