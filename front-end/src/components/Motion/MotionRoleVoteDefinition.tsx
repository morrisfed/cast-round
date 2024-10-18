import React from "react";

import { ModelRoleVotesDefinition } from "interfaces/motion";
import RoleSelect from "components/User/RoleSelect";

export interface MotionRoleVoteDefinitionProps {
  roleVote: ModelRoleVotesDefinition;
  onRoleVoteChanged: (roleVote: ModelRoleVotesDefinition) => void;
  onRemoveRoleVote: () => void;
}

const MotionRoleVoteDefinition: React.FC<MotionRoleVoteDefinitionProps> = ({
  roleVote,
  onRoleVoteChanged,
  onRemoveRoleVote,
}) => {
  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="grid grid-cols-[60px_1fr] gap-2">
          <label className="label">
            <span className="label-text">Role</span>
          </label>
          <RoleSelect
            value={roleVote.role}
            onSelect={(role) => onRoleVoteChanged({ ...roleVote, role })}
          />

          <label className="label">
            <span className="label-text">Votes</span>
          </label>
          <input
            type="number"
            value={roleVote.votes}
            onChange={(e) =>
              onRoleVoteChanged({ ...roleVote, votes: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="card-actions p-4">
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            onRemoveRoleVote();
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default MotionRoleVoteDefinition;
