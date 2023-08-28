import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import { MotionVote } from "interfaces/motion-vote";
import {
  setMotionVotes as apiSetMotionVotes,
  getMotionVoteTotals as apiGetMotionVoteTotals,
} from "api/motion-votes";

export const getMotionVoteTotals = (motionId: number | string) => {
  return pipe(apiGetMotionVoteTotals(motionId));
};

export const setMotionVotes = (
  motionId: number | string,
  onBehalfOfUserId: string,
  votes: MotionVote[]
): TE.TaskEither<Error | "forbidden", MotionVote[]> => {
  return pipe(apiSetMotionVotes(motionId, onBehalfOfUserId, votes));
};
