import React, { useCallback, useMemo } from "react";

import { ModelResponseDefinition } from "interfaces/motion";
import { MotionVote } from "interfaces/motion-vote";

export interface MotionVoteReadViewProps {
  responses: ModelResponseDefinition[];
  maxPermittedVotes: number;
  votes: MotionVote[];
  onEditVotes: () => void;
}

const MotionVoteReadView: React.FC<MotionVoteReadViewProps> = ({
  responses,
  maxPermittedVotes,
  votes,
  onEditVotes,
}) => {
  const votesSubmitted = votes.length > 0;
  const advancedVoteSubmitted = votesSubmitted && votes[0].advanced;

  const title = votesSubmitted
    ? advancedVoteSubmitted
      ? "Your advanced vote has been cast"
      : "Your vote has been cast"
    : "Vote not yet cast";
  const editButtonText = votesSubmitted ? "Change" : "Vote";

  const assignedVotesForCode = useCallback(
    (code: string) =>
      votes.find((vote) => vote.responseCode === code)?.votes || 0,
    [votes]
  );

  const allocatedVotes = useMemo(
    () => votes.map((vote) => vote.votes).reduce((a, b) => a + b, 0),
    [votes]
  );

  const unallocatedVotes = useMemo(
    () => maxPermittedVotes - allocatedVotes,
    [allocatedVotes, maxPermittedVotes]
  );

  const responseElements = useMemo(() => {
    return responses.flatMap((response) => {
      const assignedVotes = assignedVotesForCode(response.code);
      return [
        <span key={"label" + response.label}>{assignedVotes}</span>,
        <span key={"votes" + response.label}>{response.label}</span>,
      ];
    });
  }, [assignedVotesForCode, responses]);

  return (
    <>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-1">
              <span className="">Available votes</span>
              <span>{maxPermittedVotes}</span>
              <span className="">Allocated votes</span>
              <span>{allocatedVotes}</span>
              <span className="">Unallocated votes</span>
              <span>{unallocatedVotes}</span>
            </div>
            <div className="grid grid-cols-[30px_minmax(100px,_1fr)] gap-1">
              {responseElements}
            </div>
          </div>
        </div>
        <div className="card-actions p-4">
          <button
            type="button"
            className="btn-primary btn"
            onClick={onEditVotes}
          >
            {editButtonText}
          </button>
        </div>
      </div>
    </>
  );
};

export default MotionVoteReadView;
