import React, { useMemo } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Motion } from "interfaces/motion";
import { Link } from "react-router-dom";
import { useUserProfile } from "components/UserProfileContext";
import { showMotionActionButtons } from "profile/functionality";

export interface MotionDetailsProps {
  motion: Motion;
}

const MotionDetails: React.FC<MotionDetailsProps> = ({ motion }) => {
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
    switch (motion.status) {
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
    motion.status,
  ]);

  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-row gap-4">
          <div className="truncate">
            <h2 className="card-title">{motion.title}</h2>
            <article className="prose">
              <ReactMarkdown>{motion.description}</ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
      {showMotionActionButtons(profile) ? (
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

export default MotionDetails;
