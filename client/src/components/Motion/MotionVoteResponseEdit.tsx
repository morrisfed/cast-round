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
  const assignedVotesChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onAssignedVotesChanged(parseInt(event.target.value), code);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="number"
        min="0"
        max={assignedVotes + availableVotes}
        value={assignedVotes}
        onChange={assignedVotesChangedHandler}
        className="input-bordered input"
      />
    </div>
  );
};

export default MotionVoteResponseEdit;
