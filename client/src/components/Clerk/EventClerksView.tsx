import React, { useMemo, useState } from "react";

import * as O from "fp-ts/lib/Option";

import { HiLink, HiOutlineTrash, HiPlus } from "react-icons/hi2";

import { EventClerk } from "interfaces/clerks";

interface EventClerksViewProps {
  clerks: readonly EventClerk[];

  onCopyLink: (clerk: EventClerk) => void;
  onRemoveClerk: (clerk: EventClerk) => void;
  onCreateClerk: (label: string) => void;
}

const NewEventClerkView: React.FC<
  Pick<EventClerksViewProps, "onCreateClerk">
> = ({ onCreateClerk }) => {
  const [label, setLabel] = useState<string>("");

  return (
    <div className="flex w-full max-w-xs flex-row gap-2">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="input-bordered input w-full max-w-xs"
      />
      <button
        type="button"
        className="btn-outline btn-accent btn"
        onClick={(e) => {
          e.preventDefault();
          onCreateClerk(label);
        }}
      >
        <HiPlus />
      </button>
    </div>
  );
};

const EventClerksGrid: React.FC<
  Omit<EventClerksViewProps, "onCreateClerk">
> = ({ clerks, onCopyLink, onRemoveClerk }) => {
  const [deletingClerk, setDeletingClerk] = useState<O.Option<EventClerk>>(
    O.none
  );

  const gridCells = useMemo(() => {
    return clerks.map((clerk) => {
      return (
        <React.Fragment key={clerk.clerkUserId}>
          <div key={clerk.label + "-label"}>{clerk.label}</div>
          <button
            key={clerk.label + "-copy-button"}
            className="btn-ghost btn-sm btn"
            onClick={() => onCopyLink(clerk)}
          >
            <HiLink />
          </button>
          <button
            key={clerk.label + "-delete-button"}
            className="btn-ghost btn-sm btn"
            onClick={() => setDeletingClerk(O.some(clerk))}
          >
            <HiOutlineTrash />
          </button>
        </React.Fragment>
      );
    });
  }, [clerks, onCopyLink]);

  const deleteDialog = useMemo(
    () =>
      O.isSome(deletingClerk) ? (
        <div
          className="modal modal-open modal-bottom sm:modal-middle"
          onClick={() => setDeletingClerk(O.none)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">
              Delete event clerk: {deletingClerk.value.label}?
            </h3>
            <p className="py-4">
              Are you sure you want to delete this event clerk?
            </p>
            <div className="modal-action">
              <button
                type="submit"
                className="btn-outline btn-accent btn"
                onClick={(e) => {
                  e.preventDefault();
                  onRemoveClerk(deletingClerk.value);
                  setDeletingClerk(O.none);
                }}
              >
                Delete
              </button>

              <button className="btn" onClick={() => setDeletingClerk(O.none)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null,
    [deletingClerk, onRemoveClerk]
  );

  return (
    <>
      <div className="grid grid-cols-[1fr_50px_50px] gap-2">{gridCells}</div>
      {deleteDialog}
    </>
  );
};

const EventClerksView: React.FC<EventClerksViewProps> = ({
  clerks,
  onCopyLink,
  onCreateClerk,
  onRemoveClerk,
}) => {
  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col gap-4">
          {clerks.length === 0 ? null : (
            <>
              <h2 className="card-title">Event clerks</h2>
              <EventClerksGrid
                clerks={clerks}
                onCopyLink={onCopyLink}
                onRemoveClerk={onRemoveClerk}
              />
            </>
          )}
          <h2 className="card-title">Create new event clerk</h2>
          <NewEventClerkView onCreateClerk={onCreateClerk} />
        </div>
      </div>
    </div>
  );
};

export default EventClerksView;
