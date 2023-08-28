import { ModelVoteDefinition } from "interfaces/motion";
import { MotionVote } from "interfaces/motion-vote";
import { useCallback, useMemo } from "react";
import { useUserProfile } from "components/UserProfileContext";
import { Role } from "interfaces/user";
import MotionVoteResponsesEdit from "./MotionVoteResponsesEdit";

export interface MotionCastVoteProps {
  voteDefinition: ModelVoteDefinition;
  votes: MotionVote[];
  onVotesChanged: (votes: MotionVote[]) => void;
}

const MotionCastVote: React.FC<MotionCastVoteProps> = ({
  voteDefinition,
  votes,
  onVotesChanged,
}) => {
  const userProfile = useUserProfile();

  const maxVotesForRole = useCallback(
    (role: Role) =>
      voteDefinition.roleVotes.find((roleVotes) => roleVotes.role === role)
        ?.votes || 0,
    [voteDefinition]
  );

  const maxVotesForRoles = useMemo(() => {
    return userProfile.roles
      .map((role) => maxVotesForRole(role))
      .reduce((a, b) => Math.max(a, b), 0);
  }, [maxVotesForRole, userProfile]);

  const votesChangedHandler = useCallback(
    (newVotes: MotionVote[]) => {
      onVotesChanged(newVotes);
    },
    [onVotesChanged]
  );

  return (
    <>
      <MotionVoteResponsesEdit
        availableVotes={maxVotesForRoles}
        responses={voteDefinition.responses}
        votes={votes}
        onVotesChanged={votesChangedHandler}
      />
    </>
  );
};

export default MotionCastVote;
