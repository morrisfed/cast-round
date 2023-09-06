import { ModelVoteDefinition } from "interfaces/motion";
import { MotionVote } from "interfaces/motion-vote";
import { useCallback, useMemo, useState } from "react";
import MotionVoteResponsesEdit from "./MotionVoteResponsesEdit";

export interface MotionVoteEditViewProps {
  voteDefinition: ModelVoteDefinition;
  votes: MotionVote[];
  maxPermittedVotes: number;
  enableSubmitButton: boolean;
  enableWithdrawButton: boolean;
  onVotesChanged: (votes: MotionVote[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onWithdraw: () => void;
}

const MotionVoteEditView: React.FC<MotionVoteEditViewProps> = ({
  voteDefinition,
  votes,
  maxPermittedVotes,
  enableSubmitButton,
  enableWithdrawButton,
  onVotesChanged,
  onSubmit,
  onCancel,
  onWithdraw,
}) => {
  const [withdrawing, setWithdrawing] = useState<boolean>(false);

  const votesChangedHandler = useCallback(
    (newVotes: MotionVote[]) => {
      onVotesChanged(newVotes);
    },
    [onVotesChanged]
  );

  const withdrawButtonClickedHandler = useCallback(() => {
    setWithdrawing(true);
  }, []);

  const withdrawDialog = useMemo(
    () =>
      withdrawing ? (
        <div
          className="modal modal-open modal-bottom sm:modal-middle"
          onClick={() => setWithdrawing(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Withdraw votes?</h3>
            <p className="py-4">
              Are you sure you want to withdraw these votes?
            </p>
            <p className="py-4">
              You can submit them again later as long as the motion continues to
              permit voting.
            </p>
            <div className="modal-action">
              <button
                type="submit"
                className="btn-outline btn-accent btn"
                onClick={(e) => {
                  e.preventDefault();
                  onWithdraw();
                  setWithdrawing(false);
                }}
              >
                Withdraw votes
              </button>

              <button className="btn" onClick={() => setWithdrawing(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null,
    [onWithdraw, withdrawing]
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
          <button
            type="button"
            className={
              "btn " + (enableWithdrawButton ? "btn-accent" : "btn-disabled")
            }
            onClick={withdrawButtonClickedHandler}
          >
            Withdraw votes
          </button>
        </div>
      </div>
      {withdrawDialog}
    </>
  );
};

export default MotionVoteEditView;
