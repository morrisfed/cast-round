import React, { useMemo } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Vote } from "interfaces/vote";
import { Link } from "react-router-dom";
import { useUserProfile } from "components/UserProfileContext";
import { showVoteActionButtons } from "profile/functionality";

export interface VoteDetailsProps {
  vote: Vote;
}

const VoteDetails: React.FC<VoteDetailsProps> = ({ vote }) => {
  const profile = useUserProfile();

  const toAbandonedStatus = useMemo(
    () => (
      <button key="abandoned" className="btn-primary btn">
        Abandon
      </button>
    ),
    []
  );
  const toProxyStatus = useMemo(
    () => (
      <button key="proxy" className="btn-primary btn">
        Proxy-Open
      </button>
    ),
    []
  );
  const toOpenStatus = useMemo(
    () => (
      <button key="open" className="btn-primary btn">
        Open
      </button>
    ),
    []
  );
  const toClosedStatus = useMemo(
    () => (
      <button key="close" className="btn-primary btn">
        Close
      </button>
    ),
    []
  );
  const toCancelledStatus = useMemo(
    () => (
      <button key="cancel" className="btn-primary btn">
        Cancel
      </button>
    ),
    []
  );

  const statusActions = useMemo(() => {
    switch (vote.status) {
      case "draft":
        return [toOpenStatus, toProxyStatus, toAbandonedStatus];
      case "proxy":
        return [toOpenStatus, toCancelledStatus];
      case "open":
        return [toClosedStatus, toCancelledStatus];
      default:
        return [];
    }
  }, [
    toAbandonedStatus,
    toCancelledStatus,
    toClosedStatus,
    toOpenStatus,
    toProxyStatus,
    vote.status,
  ]);

  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-row gap-4">
          <div className="truncate">
            <h2 className="card-title">{vote.title}</h2>
            <article className="prose">
              <ReactMarkdown>{vote.description}</ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
      {showVoteActionButtons(profile) ? (
        <div className="card-actions p-4">
          <Link className="btn-primary btn" to={"edit"}>
            Edit
          </Link>
          {statusActions}
        </div>
      ) : null}
    </div>
  );
};

export default VoteDetails;
