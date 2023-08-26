import { ModelResponseDefinition } from "interfaces/motion";
import { MotionVote } from "interfaces/motion-vote";
import { useCallback, useMemo } from "react";
import MotionVoteResponseEdit from "./MotionVoteResponseEdit";

export interface MotionVoteResponsesEditProps {
  responses: ModelResponseDefinition[];
  maxVotes: number;
  votes: MotionVote[];
  onVotesChanged: (votes: MotionVote[]) => void;
}

const MotionVoteResponsesEdit: React.FC<MotionVoteResponsesEditProps> = ({
  responses,
  maxVotes,
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
        });
      }
      onVotesChanged(newVotes);
    },
    [onVotesChanged, votes]
  );

  const totalAssignedVotes = useMemo(
    () => votes.map((vote) => vote.votes).reduce((a, b) => a + b, 0),
    [votes]
  );

  const availableVotes = useMemo(
    () => maxVotes - totalAssignedVotes,
    [maxVotes, totalAssignedVotes]
  );

  const responseElements = useMemo(() => {
    return responses.map((response) => {
      const assignedVotes = assignedVotesForCode(response.code);
      return (
        <MotionVoteResponseEdit
          key={response.code}
          code={response.code}
          label={response.label}
          availableVotes={availableVotes}
          assignedVotes={assignedVotes}
          onAssignedVotesChanged={assignedVotesChangedHandler}
        />
      );
    });
  }, [
    assignedVotesChangedHandler,
    assignedVotesForCode,
    availableVotes,
    responses,
  ]);

  return <>{responseElements}</>;
};

export default MotionVoteResponsesEdit;
