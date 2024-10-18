import * as O from "fp-ts/lib/Option";

import { EventGroupDelegate } from "interfaces/delegates";
import { withAppFeatureFlag } from "components/AppFeatureFlagsContext";
import { useState } from "react";

interface EventGroupDelegateViewProps {
  eventGroupDelegateO: O.Option<EventGroupDelegate>;
  onCopyLink: () => void;
  onRemoveDelegate: () => void;
  onCreateDelegate: (label: string) => void;
}

const EventGroupDelegateView: React.FC<EventGroupDelegateViewProps> = ({
  eventGroupDelegateO,
  onCopyLink,
  onRemoveDelegate,
  onCreateDelegate,
}) => {
  const [label, setLabel] = useState<string>("");

  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="truncate">
          {O.isSome(eventGroupDelegateO) ? (
            <h2 className="card-title">Delegate assigned</h2>
          ) : (
            <h2 className="card-title">No delegate exists</h2>
          )}

          {O.isSome(eventGroupDelegateO) ? (
            <div className="grid grid-cols-4">
              <span className="col-span-1">Name:</span>
              <span className="col-span-3">
                {eventGroupDelegateO.value.label}
              </span>
              <span className="col-span-1">Link:</span>
              <span className="col-span-3">
                {eventGroupDelegateO.value.delegateUserLoginUrl}
              </span>
            </div>
          ) : (
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Delegate label</span>
              </label>
              <input
                type="text"
                className="input-bordered input w-full max-w-xs"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
          )}

          <div className="card-actions mt-4">
            {O.isSome(eventGroupDelegateO) ? (
              <>
                <button className="btn-primary btn" onClick={onCopyLink}>
                  Copy link
                </button>
                <button
                  className="btn-secondary btn"
                  onClick={onRemoveDelegate}
                >
                  Remove delegate
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="btn-outline btn-accent btn"
                onClick={() => onCreateDelegate(label)}
              >
                Create delegate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAppFeatureFlag("feature.ui.eventgroupdelegates")(
  EventGroupDelegateView
);
