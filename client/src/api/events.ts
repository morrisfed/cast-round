import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios, { AxiosError, AxiosResponse } from "axios";

import { Event, EventWithVotes } from "interfaces/event";
import { BuildableVote, Vote, VoteUpdates } from "interfaces/vote";

interface GetEventsResponse {
  events: Event[];
}

interface GetEventResponse {
  event: EventWithVotes;
}

interface GetEventVotesResponse {
  votes: Vote[];
}

interface GetEventVoteResponse {
  vote: Vote;
}

interface CreateEventRequest {
  event: Omit<Event, "id" | "fromDate" | "toDate"> & {
    fromDate: string;
    toDate: string;
  };
}

interface CreateEventResponse {
  event: Event;
}

interface CreateEventVoteRequest {
  vote: BuildableVote;
}

interface CreateEventVoteResponse {
  vote: Vote;
}

interface UpdateEventVoteRequest {
  voteUpdates: VoteUpdates;
}

interface UpdateEventVoteResponse {
  vote: Vote;
}

const retrieveEvents = (): TE.TaskEither<
  Error | "forbidden",
  readonly Event[]
> =>
  pipe(
    TE.tryCatch(
      () => axios.get<GetEventsResponse>("/api/events"),
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
    TE.map((data) => data.events)
  );

export const getEvents = () => pipe(retrieveEvents());

const retrieveEvent = (
  id: number | string
): TE.TaskEither<Error | "forbidden", EventWithVotes> =>
  pipe(
    TE.tryCatch(
      () => axios.get<GetEventResponse>("/api/events/" + id),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          } else if (error.response.status === 404) {
            return new Error("Event not found");
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.event)
  );

export const getEvent = (id: number | string) => pipe(retrieveEvent(id));

export const createEvent = (
  name: string,
  description: string,
  fromDateString: string,
  toDateString: string
): TE.TaskEither<Error | "forbidden", Event> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          CreateEventResponse,
          AxiosResponse<CreateEventResponse>,
          CreateEventRequest
        >(`/api/events`, {
          event: {
            name,
            description,
            fromDate: fromDateString,
            toDate: toDateString,
          },
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
    TE.map((data) => data.event)
  );
};

const retrieveEventVotes = (
  id: number | string
): TE.TaskEither<Error | "forbidden", Vote[]> =>
  pipe(
    TE.tryCatch(
      () => axios.get<GetEventVotesResponse>("/api/events/" + id + "/votes"),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          } else if (error.response.status === 404) {
            return new Error("Event not found");
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.votes)
  );

export const getEventVotes = (id: number | string) =>
  pipe(retrieveEventVotes(id));

const retrieveEventVote = (
  eventId: number | string,
  voteId: number | string
): TE.TaskEither<Error | "forbidden", Vote> =>
  pipe(
    TE.tryCatch(
      () =>
        axios.get<GetEventVoteResponse>(
          "/api/events/" + eventId + "/votes/" + voteId
        ),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          } else if (error.response.status === 404) {
            return new Error("Event not found");
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data),
    TE.map((data) => data.vote)
  );

export const getEventVote = (
  eventId: number | string,
  voteId: number | string
) => pipe(retrieveEventVote(eventId, voteId));

export const createEventVote = (
  eventId: number | string,
  buildableVote: BuildableVote
): TE.TaskEither<Error | "forbidden", Vote> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.post<
          CreateEventVoteResponse,
          AxiosResponse<CreateEventVoteResponse>,
          CreateEventVoteRequest
        >(`/api/events/${eventId}/votes`, {
          vote: buildableVote,
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
    TE.map((data) => data.vote)
  );
};

export const updateEventVote = (
  eventId: number | string,
  voteId: number | string,
  updates: VoteUpdates
): TE.TaskEither<Error | "forbidden", Vote> => {
  return pipe(
    TE.tryCatch(
      () =>
        axios.patch<
          UpdateEventVoteResponse,
          AxiosResponse<UpdateEventVoteResponse>,
          UpdateEventVoteRequest
        >(`/api/events/${eventId}/votes/${voteId}`, {
          voteUpdates: updates,
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
    TE.map((data) => data.vote)
  );
};
