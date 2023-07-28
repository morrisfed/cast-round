import React, { useMemo, useState } from "react";

import * as O from "fp-ts/lib/Option";

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Motion, MotionStatus } from "interfaces/motion";
import { Form, Link } from "react-router-dom";
import { useUserProfile } from "components/UserProfileContext";
import { showMotionActionButtons } from "profile/functionality";

export interface MotionDetailsProps {
  motion: Motion;
}

const MotionDetails: React.FC<MotionDetailsProps> = ({ motion }) => {
  const profile = useUserProfile();

  const [changingStatus, setChangingStatus] = useState<O.Option<MotionStatus>>(
    O.none
  );

  const toDiscardedStatus = useMemo(
    () => (
      <button
        key="discarded"
        className="btn-primary btn"
        onClick={() => setChangingStatus(O.of("discarded"))}
      >
        Discard
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
        return [toOpenStatus, toProxyStatus, toDiscardedStatus];
      case "proxy":
        return [toOpenStatus, toCancelledStatus];
      case "open":
        return [toClosedStatus, toCancelledStatus];
      default:
        return [];
    }
  }, [
    toDiscardedStatus,
    toCancelledStatus,
    toClosedStatus,
    toOpenStatus,
    toProxyStatus,
    motion.status,
  ]);

  const changeStatusDialog = useMemo(
    () =>
      O.isSome(changingStatus) ? (
        <div
          className="modal modal-open modal-bottom sm:modal-middle"
          onClick={() => setChangingStatus(O.none)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">
              Change motion status to: {changingStatus.value}?
            </h3>
            <p className="py-4">
              Are you sure you want to change this motion&rsquo;s status?
            </p>
            <div className="modal-action">
              <Form method="POST" onSubmit={() => setChangingStatus(O.none)}>
                <input name="intent" type="hidden" value="change-status" />
                <input
                  name="motionStatus"
                  type="hidden"
                  value={changingStatus.value}
                />

                <button type="submit" className="btn-outline btn-accent btn">
                  Change status
                </button>
              </Form>

              <button className="btn" onClick={() => setChangingStatus(O.none)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null,
    [changingStatus]
  );

  return (
    <>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="truncate">
              <h2 className="card-title">{motion.title}</h2>
              <p>Status: {motion.status}</p>
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
      {changeStatusDialog}
    </>
  );
};

export default MotionDetails;
