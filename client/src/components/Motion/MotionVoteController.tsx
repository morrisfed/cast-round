import React, { useCallback, useEffect, useMemo, useState } from "react";

import * as E from "fp-ts/lib/Either";

import { Motion } from "interfaces/motion";
import { MotionVote } from "interfaces/motion-vote";
import { getMotionVotes, setMotionVotes } from "events/motion-votes-service";
import Spinner from "components/Spinner";
import MotionVoteReadView from "./MotionVoteReadView";
import MotionVoteEditView from "./MotionVoteEditView";
import { Role } from "interfaces/user";

export interface MotionVoteControllerProps {
  memberId: string;
  motion: Motion;
  roles: Role[];
}

const MotionVoteController: React.FC<MotionVoteControllerProps> = ({
  memberId,
  motion,
  roles,
}) => {
  const [votes, setVotes] = useState<MotionVote[]>([]);
  const [clientVotes, setClientVotes] = useState<MotionVote[]>([]);
  const [clientVotesDirty, setClientVotesDirty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [view, setView] = useState<"read" | "edit">("read");

  const onRefreshHandler = useCallback(async () => {
    setLoading(true);
    setError(false);
    const getMotionVotesTask = getMotionVotes(motion.id, memberId);
    const result = await getMotionVotesTask();

    if (E.isLeft(result)) {
      setError(true);
    } else {
      setVotes(result.right);
      setClientVotes(result.right);
    }
    setLoading(false);
  }, [memberId, motion.id]);

  const onVotesChangedHandler = useCallback((votes: MotionVote[]) => {
    setClientVotes(votes);
    setClientVotesDirty(true);
  }, []);

  const onEditHandler = useCallback(() => {
    setView("edit");
  }, []);

  const onCancelHandler = useCallback(() => {
    setClientVotes(votes);
    setClientVotesDirty(false);
    setView("read");
  }, [votes]);

  const onSubmitHandler = useCallback(async () => {
    setLoading(true);
    setError(false);
    const setMotionVotesTask = setMotionVotes(motion.id, memberId, clientVotes);
    const result = await setMotionVotesTask();

    if (E.isLeft(result)) {
      setError(true);
    } else {
      setVotes(result.right);
      setClientVotesDirty(false);
    }
    setLoading(false);
    setView("read");
  }, [clientVotes, memberId, motion.id]);

  const maxVotesForRole = useCallback(
    (role: Role) =>
      motion.voteDefinition.roleVotes.find(
        (roleVotes) => roleVotes.role === role
      )?.votes || 0,
    [motion.voteDefinition]
  );

  const maxVotesForRoles = useMemo(() => {
    return roles
      .map((role) => maxVotesForRole(role))
      .reduce((a, b) => Math.max(a, b), 0);
  }, [maxVotesForRole, roles]);

  const showMotionControllerView = useMemo(() => {
    return motion.status !== "draft" && motion.status !== "discarded";
  }, [motion]);

  const canSubmitVotes = useMemo(
    () => motion.status === "open" || motion.status === "advanced",
    [motion]
  );

  useEffect(() => {
    if (showMotionControllerView) {
      onRefreshHandler();
    }
  }, [onRefreshHandler, showMotionControllerView]);

  if (!showMotionControllerView) {
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div>
        <p>An error has occured while loading your votes.</p>
        <p>Please tap refresh to try again.</p>
        <button className="btn-primary btn" onClick={() => onRefreshHandler()}>
          Refresh
        </button>
      </div>
    );
  }

  if (view === "read") {
    return (
      <>
        <MotionVoteReadView
          responses={motion.voteDefinition.responses}
          votes={votes}
          maxPermittedVotes={maxVotesForRoles}
          enableEdit={canSubmitVotes}
          onEditVotes={onEditHandler}
        />
      </>
    );
  }
  return (
    <>
      <MotionVoteEditView
        voteDefinition={motion.voteDefinition}
        votes={clientVotes}
        maxPermittedVotes={maxVotesForRoles}
        enableSubmitButton={clientVotesDirty}
        onVotesChanged={onVotesChangedHandler}
        onSubmit={onSubmitHandler}
        onCancel={onCancelHandler}
      />
    </>
  );
};

export default MotionVoteController;
