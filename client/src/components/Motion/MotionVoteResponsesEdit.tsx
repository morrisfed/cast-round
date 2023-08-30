import { ModelResponseDefinition } from "interfaces/motion";
import { MotionVote } from "interfaces/motion-vote";
import { useCallback, useMemo } from "react";
import MotionVoteResponseEdit from "./MotionVoteResponseEdit";

export interface MotionVoteResponsesEditProps {
  responses: ModelResponseDefinition[];
  availableVotes: number;
  votes: MotionVote[];
  onVotesChanged: (votes: MotionVote[]) => void;
}

const MotionVoteResponsesEdit: React.FC<MotionVoteResponsesEditProps> = ({
  responses,
  availableVotes,
  votes,
  onVotesChanged,
}) => {
  const assignedVotesForCode = useCallback(
    (code: string) =>
      votes.find((vote) => vote.responseCode === code)?.votes || 0,
    [votes]
  );

  const assignedVotesChangedHandler = useCallback(
    (assignedVotes: number, code: string) => {
      const newVotes = votes.filter((vote) => vote.responseCode !== code);
      if (assignedVotes > 0) {
        newVotes.push({
          responseCode: code,
          votes: assignedVotes,
          advanced: false,
        });
      }
      onVotesChanged(newVotes);
    },
    [onVotesChanged, votes]
  );

  const allocatedVotes = useMemo(
    () => votes.map((vote) => vote.votes).reduce((a, b) => a + b, 0),
    [votes]
  );

  const unallocatedVotes = useMemo(
    () => availableVotes - allocatedVotes,
    [allocatedVotes, availableVotes]
  );

  const responseElements = useMemo(() => {
    return responses.map((response) => {
      const assignedVotes = assignedVotesForCode(response.code);
      return (
        <MotionVoteResponseEdit
          key={response.code}
          code={response.code}
          label={response.label}
          availableVotes={unallocatedVotes}
          assignedVotes={assignedVotes}
          onAssignedVotesChanged={assignedVotesChangedHandler}
        />
      );
    });
  }, [
    assignedVotesChangedHandler,
    assignedVotesForCode,
    responses,
    unallocatedVotes,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-1">
        <span className="">Available votes</span>
        <span>{availableVotes}</span>
        <span className="">Allocated votes</span>
        <span>{allocatedVotes}</span>
        <span className="">Unallocated votes</span>
        <span>{unallocatedVotes}</span>
      </div>
      <div className="grid grid-cols-[30px_50px_30px_minmax(100px,_1fr)] gap-1">
        {responseElements}
      </div>
    </div>
  );
};

export default MotionVoteResponsesEdit;
