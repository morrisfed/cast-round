import React from "react";

import { ModelVoteDefinition } from "interfaces/motion";
import { MotionVoteSubtotal } from "interfaces/motion-vote";
import MotionTotalsTable from "./MotionTotalsTable";

export interface MotionTotalsViewProps {
  voteDefinition: ModelVoteDefinition;
  subtotals: MotionVoteSubtotal[];
  onRefresh: () => void;
}

const MotionTotalsView: React.FC<MotionTotalsViewProps> = ({
  voteDefinition,
  subtotals,
  onRefresh,
}) => {
  return (
    <>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="truncate">
              <h2 className="card-title">Vote totals</h2>
              <article>
                <MotionTotalsTable
                  voteDefinition={voteDefinition}
                  subtotals={subtotals}
                />
              </article>
            </div>
          </div>
        </div>
        <div className="card-actions p-4">
          <button className="btn-primary btn" onClick={() => onRefresh()}>
            Refresh
          </button>
        </div>
      </div>
    </>
  );
};

export default MotionTotalsView;
