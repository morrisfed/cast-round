import React from "react";
import { Link } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Motion } from "interfaces/motion";

export interface VoteItemProps {
  eventId: string | number;
  vote: Motion;
  showVoteDescription: boolean;
}

const VoteItem: React.FC<VoteItemProps> = ({
  eventId,
  vote,
  showVoteDescription,
}) => {
  return (
    <Link to={`/events/${eventId}/votes/${vote.id}`}>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="truncate">
              <h2 className="card-title">{vote.title}</h2>
              {showVoteDescription ? (
                <article className="prose">
                  <ReactMarkdown>{vote.description}</ReactMarkdown>
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VoteItem;
