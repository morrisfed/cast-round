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

  const roleVoteElements = useMemo(() => {
    return roleVotes.map((roleVote, index) => (
      <MotionRoleVoteDefinition
        key={index}
        roleVote={roleVote}
        onRoleVoteChanged={(roleVote) =>
          roleVoteChangedHandler(roleVote, index)
        }
      />
    ));
  }, [roleVoteChangedHandler, roleVotes]);

  return (
    <>
      {roleVoteElements}
      <button
        onClick={(e) => {
          e.preventDefault();
          onRoleVotesChanged([
            ...roleVotes,
            { role: "ADMINISTRATOR", votes: 0 },
          ]);
        }}
      >
        Add role votes
      </button>
    </>
  );
};

export default MotionRoleVotesDefinition;
