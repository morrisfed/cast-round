import React, { useMemo } from "react";
import { Motion } from "interfaces/motion";
import VoteItem from "./VoteItem";

export interface VoteListProps {
  eventId: string | number;
  votes: readonly Motion[];
  showVoteDescription: boolean;
}

const VoteList: React.FC<VoteListProps> = ({
  eventId,
  votes,
  showVoteDescription,
}) => {
  const items = useMemo(() => {
    return votes.map((vote) => {
      return (
        <div key={vote.id} className="grow sm:w-80">
          <VoteItem
            eventId={eventId}
            vote={vote}
            showVoteDescription={showVoteDescription}
          />
        </div>
      );
    });
  }, [eventId, votes, showVoteDescription]);

  return <div className="flex flex-row flex-wrap gap-2">{items}</div>;
};

export default VoteList;
