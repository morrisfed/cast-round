import { EventTellor } from "interfaces/tellors";
import { useMemo } from "react";
import { Form, Link } from "react-router-dom";

interface EventTellorsViewProps {
  eventTellors: readonly EventTellor[];
}

interface SingleEventTellorViewProps {
  eventTellor: EventTellor;
}

const SingleTellorDelegateView: React.FC<SingleEventTellorViewProps> = ({
  eventTellor,
}) => {
  return (
    <div>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="truncate">
            <h2 className="card-title">Event tellor</h2>
            <div className="grid grid-cols-4">
              <span className="col-span-1">Name:</span>
              <span className="col-span-3">{eventTellor.label}</span>
              <span className="col-span-1">Link:</span>
              <span className="col-span-3">
                {eventTellor.tellorUserLoginUrl}
              </span>
            </div>
            <div className="card-actions mt-4">
              <button
                className="btn-primary btn"
                onClick={() =>
                  navigator.clipboard.writeText(eventTellor.tellorUserLoginUrl)
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
    </div>
  );
};

const NewEventTellorView: React.FC = () => {
  return (
    <div>
      <h1>Create new event tellor</h1>
      <Form method="POST">
        <div className="form-control w-full max-w-xs">
          <input name="intent" type="hidden" value="create-event-tellor" />
          <label className="label">
            <span className="label-text">Tellor label</span>
          </label>
          <input
            name="label"
            type="text"
            placeholder="Label"
            className="input-bordered input w-full max-w-xs"
          />
          <button type="submit" className="btn-outline btn-accent btn">
            Create tellor
          </button>
        </div>
      </Form>
    </div>
  );
};

const EventTellorsView: React.FC<EventTellorsViewProps> = ({
  eventTellors,
}) => {
  const existingTellors = useMemo(() => {
    const tellorElements = eventTellors.map((tellor) => (
      <SingleTellorDelegateView key={tellor.label} eventTellor={tellor} />
    ));

    return (
      <div>
        {tellorElements}
        <NewEventTellorView />
      </div>
    );
  }, [eventTellors]);

  return <div>{existingTellors}</div>;
};

export default EventTellorsView;
