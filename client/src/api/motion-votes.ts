import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios, { AxiosError, AxiosResponse } from "axios";

import { MotionVote } from "interfaces/motion-vote";

interface GetMotionVotesResponse {
  votes: MotionVote[];
}

interface SubmitMotionVoteRequest {
  code: string;
  count: number;
}

interface SubmitMotionVotesRequest {
  votes: SubmitMotionVoteRequest[];
}

interface SubmitMotionVotesResponse {
  votes: MotionVote[];
}

export const getMotionVotes = (
  motionId: number | string
): TE.TaskEither<Error | "forbidden", MotionVote[]> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.get<
          GetMotionVotesResponse,
          AxiosResponse<GetMotionVotesResponse>
        >(`/api/motionvote/${motionId}`),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.votes)
  );
};

export const setMotionVotes = (
  motionId: number | string,
  votes: MotionVote[]
): TE.TaskEither<Error | "forbidden", MotionVote[]> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          SubmitMotionVotesResponse,
          AxiosResponse<SubmitMotionVotesResponse>,
          SubmitMotionVotesRequest
        >(`/api/motionvote/${motionId}`, {
          votes: votes.map((vote) => ({
            code: vote.responseCode,
            count: vote.votes,
          })),
        }),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.votes)
  );
};
