import { ModelVoteDefinition } from "interfaces/motion";
import { MotionVote } from "interfaces/motion-vote";
import { useCallback } from "react";
import MotionVoteResponsesEdit from "./MotionVoteResponsesEdit";

export interface MotionVoteEditViewProps {
  voteDefinition: ModelVoteDefinition;
  votes: MotionVote[];
  maxPermittedVotes: number;
  enableSubmitButton: boolean;
  onVotesChanged: (votes: MotionVote[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const MotionVoteEditView: React.FC<MotionVoteEditViewProps> = ({
  voteDefinition,
  votes,
  maxPermittedVotes,
  enableSubmitButton,
  onVotesChanged,
  onSubmit,
  onCancel,
}) => {
  const votesChangedHandler = useCallback(
    (newVotes: MotionVote[]) => {
      onVotesChanged(newVotes);
    },
    [onVotesChanged]
  );

  return (
    <>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col gap-4">
            <h2 className="card-title">Cast votes</h2>
            <MotionVoteResponsesEdit
              availableVotes={maxPermittedVotes}
              responses={voteDefinition.responses}
              votes={votes}
              onVotesChanged={votesChangedHandler}
            />
          </div>
        </div>
        <div className="card-actions p-4">
          <button
            type="button"
            className={
              "btn " + (enableSubmitButton ? "btn-primary" : "btn-disabled")
            }
            onClick={onSubmit}
          >
            Submit
          </button>
          <button
            type="button"
            className="btn-secondary btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default MotionVoteEditView;
