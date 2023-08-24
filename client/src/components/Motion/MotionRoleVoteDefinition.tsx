import React from "react";

import { ModelRoleVotesDefinition } from "interfaces/motion";
import RoleSelect from "components/User/RoleSelect";

export interface MotionRoleVoteDefinitionProps {
  roleVote: ModelRoleVotesDefinition;
  onRoleVoteChanged: (roleVote: ModelRoleVotesDefinition) => void;
}

const MotionRoleVoteDefinition: React.FC<MotionRoleVoteDefinitionProps> = ({
  roleVote,
  onRoleVoteChanged,
}) => {
  return (
    <>
      <RoleSelect
        value={roleVote.role}
        onSelect={(role) => onRoleVoteChanged({ ...roleVote, role })}
      />
      <input
        type="number"
        value={roleVote.votes}
        onChange={(e) =>
          onRoleVoteChanged({ ...roleVote, votes: Number(e.target.value) })
        }
      />
    </>
  );
};

export default MotionRoleVoteDefinition;
