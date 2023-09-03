import React, { useCallback, useMemo } from "react";

import { ModelRoleVotesDefinition } from "interfaces/motion";
import MotionRoleVoteDefinition from "./MotionRoleVoteDefinition";

export interface MotionRoleVotesDefinitionProps {
  roleVotes: ModelRoleVotesDefinition[];
  onRoleVotesChanged: (roleVotes: ModelRoleVotesDefinition[]) => void;
}

const MotionRoleVotesDefinition: React.FC<MotionRoleVotesDefinitionProps> = ({
  roleVotes,
  onRoleVotesChanged,
}) => {
  const roleVoteChangedHandler = useCallback(
    (roleVote: ModelRoleVotesDefinition, index: number) => {
      const newRoleVotes = [...roleVotes];
      newRoleVotes[index] = roleVote;

      onRoleVotesChanged(newRoleVotes);
    },
    [onRoleVotesChanged, roleVotes]
  );

  const roleVoteRemovedHandler = useCallback(
    (index: number) => {
      const newRoleVotes = [...roleVotes];
      newRoleVotes.splice(index, 1);

      onRoleVotesChanged(newRoleVotes);
    },
    [onRoleVotesChanged, roleVotes]
  );

  const roleVoteElements = useMemo(() => {
    return roleVotes.map((roleVote, index) => (
      <MotionRoleVoteDefinition
        key={index}
        roleVote={roleVote}
        onRoleVoteChanged={(roleVote) =>
          roleVoteChangedHandler(roleVote, index)
        }
        onRemoveRoleVote={() => roleVoteRemovedHandler(index)}
      />
    ));
  }, [roleVoteChangedHandler, roleVoteRemovedHandler, roleVotes]);

  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <h1>Set votes per role</h1>
          <button
            className="btn-primary btn"
            onClick={(e) => {
              e.preventDefault();
              onRoleVotesChanged([
                ...roleVotes,
                { role: "ADMINISTRATOR", votes: 0 },
              ]);
            }}
          >
            Add
          </button>
        </div>
        {roleVoteElements}
      </div>
    </div>
  );
};

export default MotionRoleVotesDefinition;
