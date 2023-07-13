import React, { useMemo } from "react";
import { Motion } from "interfaces/motion";
import MotionItem from "./MotionItem";

export interface MotionListProps {
  eventId: string | number;
  motions: readonly Motion[];
  showMotionDescription: boolean;
}

const MotionList: React.FC<MotionListProps> = ({
  eventId,
  motions,
  showMotionDescription,
}) => {
  const items = useMemo(() => {
    return motions.map((vote) => {
      return (
        <div key={vote.id} className="grow sm:w-80">
          <MotionItem
            eventId={eventId}
            motion={vote}
            showMotionDescription={showMotionDescription}
          />
        </div>
      );
    });
  }, [eventId, motions, showMotionDescription]);

  return <div className="flex flex-row flex-wrap gap-2">{items}</div>;
};

export default MotionList;
