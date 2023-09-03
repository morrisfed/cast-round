import React, { useMemo, useState } from "react";

import * as O from "fp-ts/lib/Option";

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { MotionStatus, MotionWithOptionalVotes } from "interfaces/motion";
import { Form, Link } from "react-router-dom";
import { useUserProfile } from "components/UserProfileContext";
import { showMotionActionButtons } from "profile/functionality";

export interface MotionDetailsViewProps {
  motion: MotionWithOptionalVotes;
}

const MotionDetailsView: React.FC<MotionDetailsViewProps> = ({ motion }) => {
  const profile = useUserProfile();

  const [changingStatus, setChangingStatus] = useState<O.Option<MotionStatus>>(
    O.none
  );

  const toDraftStatus = useMemo(
    () => (
      <button
        key="discarded"
        className="btn-primary btn"
        onClick={() => setChangingStatus(O.of("draft"))}
      >
        Draft
      </button>
    ),
    []
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
  const toAdvancedStatus = useMemo(
    () => (
      <button
        key="advanced"
        className="btn-primary btn"
        onClick={() => setChangingStatus(O.of("advanced"))}
      >
        Advanced-Open
      </button>
    ),
    []
  );
  const toHoldStatus = useMemo(
    () => (
      <button
        key="hold"
        className="btn-primary btn"
        onClick={() => setChangingStatus(O.of("hold"))}
      >
        Hold
      </button>
    ),
    []
  );
  const toOpenStatus = useMemo(
    () => (
      <button
        key="open"
        className="btn-primary btn"
        onClick={() => setChangingStatus(O.of("open"))}
      >
        Open
      </button>
    ),
    []
  );
  const toClosedStatus = useMemo(
    () => (
      <button
        key="close"
        className="btn-primary btn"
        onClick={() => setChangingStatus(O.of("closed"))}
      >
        Close
      </button>
    ),
    []
  );
  const toCancelledStatus = useMemo(
    () => (
      <button
        key="cancel"
        className="btn-primary btn"
        onClick={() => setChangingStatus(O.of("cancelled"))}
      >
        Cancel
      </button>
    ),
    []
  );

  const statusActions = useMemo(() => {
    switch (motion.status) {
      case "draft":
        return [toOpenStatus, toAdvancedStatus, toDiscardedStatus];
      case "advanced":
        return [toDraftStatus, toHoldStatus, toOpenStatus, toCancelledStatus];
      case "hold":
        return [toAdvancedStatus, toOpenStatus, toCancelledStatus];
      case "open":
        return [
          toDraftStatus,
          toHoldStatus,
          toAdvancedStatus,
          toClosedStatus,
          toCancelledStatus,
        ];
      case "cancelled":
        return [toAdvancedStatus, toHoldStatus, toOpenStatus];
      case "closed":
        return [toOpenStatus];
      case "discarded":
        return [toDraftStatus];
      default:
        return [];
    }
  }, [
    motion.status,
    toOpenStatus,
    toAdvancedStatus,
    toDiscardedStatus,
    toDraftStatus,
    toHoldStatus,
    toCancelledStatus,
    toClosedStatus,
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
          <h2 className="card-title">{motion.title}</h2>
          <p>Status: {motion.status}</p>
          <article className="prose">
            <ReactMarkdown linkTarget="_blank">
              {motion.description}
            </ReactMarkdown>
          </article>
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

export default MotionDetailsView;
