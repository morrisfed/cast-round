import React, { useMemo, useState } from "react";
import { Form } from "react-router-dom";

import * as O from "fp-ts/lib/Option";

import { HiLink, HiOutlineTrash, HiPlus } from "react-icons/hi2";

import { EventTellor } from "interfaces/tellors";
import { withAppFeatureFlag } from "components/AppFeatureFlagsContext";

interface EventTellorsViewProps {
  eventTellors: readonly EventTellor[];
}

const NewEventTellorView: React.FC = () => {
  return (
    <div>
      <Form method="POST">
        <input name="intent" type="hidden" value="create-event-tellor" />
        <div className="flex w-full max-w-xs flex-row gap-2">
          <input
            name="label"
            type="text"
            placeholder="Label"
            className="input-bordered input w-full max-w-xs"
          />
          <button type="submit" className="btn-outline btn-accent btn">
            <HiPlus />
          </button>
        </div>
      </Form>
    </div>
  );
};

const EventTellorsGrid: React.FC<EventTellorsViewProps> = ({
  eventTellors,
}) => {
  const [deletingTellor, setDeletingTellor] = useState<O.Option<EventTellor>>(
    O.none
  );

  const gridCells = useMemo(() => {
    return eventTellors.map((tellor) => {
      return (
        <React.Fragment key={tellor.tellorUserId}>
          <div key={tellor.label + "-label"}>{tellor.label}</div>
          <button
            key={tellor.label + "-copy-button"}
            className="btn-ghost btn-sm btn"
            onClick={() =>
              navigator.clipboard.writeText(tellor.tellorUserLoginUrl)
            }
          >
            <HiLink />
          </button>
          <button
            key={tellor.label + "-delete-button"}
            className="btn-ghost btn-sm btn"
            onClick={() => setDeletingTellor(O.some(tellor))}
          >
            <HiOutlineTrash />
          </button>
        </React.Fragment>
      );
    });
  }, [eventTellors]);

  const deleteDialog = useMemo(
    () =>
      O.isSome(deletingTellor) ? (
        <div
          className="modal modal-open modal-bottom sm:modal-middle"
          onClick={() => setDeletingTellor(O.none)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">
              Delete event tellor: {deletingTellor.value.label}?
            </h3>
            <p className="py-4">
              Are you sure you want to delete this event tellor?
            </p>
            <div className="modal-action">
              <Form method="POST" onSubmit={() => setDeletingTellor(O.none)}>
                <input
                  name="intent"
                  type="hidden"
                  value="delete-event-tellor"
                />
                <input
                  name="tellorUserId"
                  type="hidden"
                  value={deletingTellor.value.tellorUserId}
                />

                <button type="submit" className="btn-outline btn-accent btn">
                  Delete
                </button>
              </Form>

              <button className="btn" onClick={() => setDeletingTellor(O.none)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null,
    [deletingTellor]
  );

  return (
    <>
      <div className="grid grid-cols-[1fr_50px_50px] gap-2">{gridCells}</div>
      {deleteDialog}
    </>
  );
};

const EventTellorsView: React.FC<EventTellorsViewProps> = ({
  eventTellors,
}) => {
  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col gap-4">
          {eventTellors.length === 0 ? null : (
            <>
              <h2 className="card-title">Event tellers</h2>
              <EventTellorsGrid eventTellors={eventTellors} />
            </>
          )}
          <h2 className="card-title">Create new event teller</h2>
          <NewEventTellorView />
        </div>
      </div>
    </div>
  );
};

export default withAppFeatureFlag("feature.ui.eventtellors")(EventTellorsView);
