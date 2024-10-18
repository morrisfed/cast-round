import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios, { AxiosError, AxiosResponse } from "axios";

import { MotionVote, MotionVoteSubtotal } from "interfaces/motion-vote";

interface GetMotionVoteTotalsResponse {
  subtotals: MotionVoteSubtotal[];
}

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

export const getMotionVoteTotals = (motionId: number | string) => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.get<
          GetMotionVoteTotalsResponse,
          AxiosResponse<GetMotionVoteTotalsResponse>
        >(`/api/motionvote/${motionId}/totals`),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          } else if (error.response.status === 404) {
            return "not-found";
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.subtotals)
  );
};

export const getMotionVotes = (
  motionId: number | string,
  onBehalfOfUserId: string
): TE.TaskEither<Error | "forbidden", MotionVote[]> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.get<
          GetMotionVotesResponse,
          AxiosResponse<GetMotionVotesResponse>
        >(`/api/motionvote/${motionId}/${onBehalfOfUserId}`),
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
  onBehalfOfUserId: string,
  votes: MotionVote[]
): TE.TaskEither<Error | "forbidden", MotionVote[]> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          SubmitMotionVotesResponse,
          AxiosResponse<SubmitMotionVotesResponse>,
          SubmitMotionVotesRequest
        >(`/api/motionvote/${motionId}/${onBehalfOfUserId}`, {
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
