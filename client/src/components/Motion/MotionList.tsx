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
    return motions.map((motion) => {
      return (
        <div key={motion.id} className="grow sm:w-80">
          <MotionItem
            eventId={eventId}
            motion={motion}
            showMotionDescription={showMotionDescription}
          />
        </div>
      );
    });
  }, [eventId, motions, showMotionDescription]);

  return <div className="flex flex-row flex-wrap gap-2">{items}</div>;
};

export default MotionList;
