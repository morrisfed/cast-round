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
      if (assignedVotes >= 0) {
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

  const singleVoteMotionResponseSelectedHandler = useCallback(
    (code: string) => {
      onVotesChanged([{ responseCode: code, votes: 1, advanced: false }]);
    },
    [onVotesChanged]
  );

  const singleVoteMotion = useMemo(
    () => availableVotes === 1,
    [availableVotes]
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
    if (singleVoteMotion) {
      return responses.map((response) => {
        const assignedVotes = assignedVotesForCode(response.code);
        return (
          <div className="form-control" key={response.code}>
            <label className="label cursor-pointer justify-normal gap-4">
              <input
                type="radio"
                name={response.code}
                className="radio checked:bg-blue-500"
                checked={assignedVotes > 0}
                onChange={() => {
                  singleVoteMotionResponseSelectedHandler(response.code);
                }}
              />
              <span className="text-left">{response.label}</span>
            </label>
          </div>
        );
      });
    }

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
    singleVoteMotion,
    unallocatedVotes,
  ]);

  if (singleVoteMotion) {
    return <div className="flex flex-col gap-4">{responseElements}</div>;
  } else {
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
  }
};

export default MotionVoteResponsesEdit;
