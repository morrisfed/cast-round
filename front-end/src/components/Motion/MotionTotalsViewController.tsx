import React, { useCallback, useEffect, useMemo, useState } from "react";

import * as E from "fp-ts/lib/Either";

import { Motion } from "interfaces/motion";
import { MotionVoteSubtotal } from "interfaces/motion-vote";
import { getMotionVoteTotals } from "events/motion-votes-service";
import Spinner from "components/Spinner";
import MotionTotalsView from "./MotionTotalsView";

export interface MotionTotalsViewControllerProps {
  motion: Motion;
}

const MotionTotalsViewController: React.FC<MotionTotalsViewControllerProps> = ({
  motion,
}) => {
  const [subtotals, setSubtotals] = useState<MotionVoteSubtotal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setLoading(true);
    setError(false);
    const getMotionVoteTotalsTask = getMotionVoteTotals(motion.id);
    const result = await getMotionVoteTotalsTask();

    if (E.isLeft(result)) {
      setError(true);
    } else {
      setSubtotals(result.right);
    }
    setLoading(false);
  }, [motion]);

  const showMotionTotalsView = useMemo(() => {
    return motion.status !== "draft" && motion.status !== "discarded";
  }, [motion]);

  useEffect(() => {
    if (showMotionTotalsView) {
      onRefresh();
    }
  }, [onRefresh, showMotionTotalsView]);

  if (!showMotionTotalsView) {
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div>
        <p>An error has occured while loading motion vote totals.</p>
        <p>Please tap refresh to try again.</p>
        <button className="btn-primary btn" onClick={() => onRefresh()}>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <>
      <MotionTotalsView
        voteDefinition={motion.voteDefinition}
        subtotals={subtotals}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default MotionTotalsViewController;
