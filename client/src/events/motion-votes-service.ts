import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import { MotionVote } from "interfaces/motion-vote";
import { setMotionVotes as apiSetMotionVotes } from "api/motion-votes";

export const setMotionVotes = (
  motionId: number | string,
  votes: MotionVote[]
): TE.TaskEither<Error | "forbidden", MotionVote[]> => {
  return pipe(apiSetMotionVotes(motionId, votes));
};
