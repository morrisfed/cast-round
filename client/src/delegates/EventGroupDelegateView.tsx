import * as O from "fp-ts/lib/Option";
import { EventGroupDelegate } from "interfaces/delegates";
import { Form, Link } from "react-router-dom";

interface EventGroupDelegateViewProps {
  eventGroupDelegateO: O.Option<EventGroupDelegate>;
}

const EventGroupDelegateView: React.FC<EventGroupDelegateViewProps> = ({
  eventGroupDelegateO,
}) => {
  return (
    <div>
      {O.isSome(eventGroupDelegateO) ? (
        <div className="card-bordered card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="truncate">
              <h2 className="card-title">Delegate assigned</h2>
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
              <div className="card-actions mt-4">
                <button
                  className="btn-primary btn"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      eventGroupDelegateO.value.delegateUserLoginUrl
                    )
                  }
                >
                  Copy link
                </button>
                <Link to="confirmRemoveDelegate" className="btn-secondary btn">
                  Remove delegate
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>No delegate exists</h1>
          <Form method="POST">
            <div className="form-control w-full max-w-xs">
              <input
                name="intent"
                type="hidden"
                value="create-event-group-delegate"
              />
              <label className="label">
                <span className="label-text">Delegate label</span>
              </label>
              <input
                name="label"
                type="text"
                placeholder="Label"
                className="input-bordered input w-full max-w-xs"
              />
              <button type="submit" className="btn-outline btn-accent btn">
                Create delegate
              </button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default EventGroupDelegateView;
