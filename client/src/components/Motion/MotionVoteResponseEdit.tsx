export interface MotionVoteResponseEditProps {
  code: string;
  label: string;
  availableVotes: number;
  assignedVotes: number;
  onAssignedVotesChanged: (assignedVotes: number, code: string) => void;
}

const MotionVoteResponseEdit: React.FC<MotionVoteResponseEditProps> = ({
  code,
  label,
  availableVotes,
  assignedVotes,
  onAssignedVotesChanged,
}) => {
  return (
    <>
      <button
        type="button"
        className={
          "btn-primary btn " + (assignedVotes > 0 ? "" : "btn-disabled")
        }
        onClick={() => onAssignedVotesChanged(assignedVotes - 1, code)}
      >
        -
      </button>
      <span className="text-center">{assignedVotes}</span>
      <button
        type="button"
        className={
          "btn-primary btn " + (availableVotes > 0 ? "" : "btn-disabled")
        }
        onClick={() => onAssignedVotesChanged(assignedVotes + 1, code)}
      >
        +
      </button>
      <span className="px-2">{label}</span>
    </>
  );
};

export default MotionVoteResponseEdit;
