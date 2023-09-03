import React from "react";
import { Link } from "react-router-dom";
import { Event } from "interfaces/event";
import { useUserProfile } from "components/UserProfileContext";
import { showEditEventButton } from "profile/functionality";

const ReactMarkdown = React.lazy(
  () => import("../lazy/LazyLoadableReactMarkdown")
);

export interface EventItemProps {
  event: Event;
}

const datetimeFormatter = Intl.DateTimeFormat(undefined, {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const EventDetails: React.FC<EventItemProps> = ({ event }) => {
  const profile = useUserProfile();

  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-row gap-4">
          <h2 className="card-title">{event.name}</h2>
          <p>Open: {datetimeFormatter.format(event.fromDate)}</p>
          <p>Close: {datetimeFormatter.format(event.toDate)}</p>
          <article className="prose">
            <React.Suspense fallback={<div>Loading...</div>}>
              <ReactMarkdown>{event.description}</ReactMarkdown>
            </React.Suspense>
          </article>
        </div>
      </div>
      <div className="card-actions p-4">
        {showEditEventButton(profile) ? (
          <Link className="btn-primary btn" to={"edit"}>
            Edit
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default EventDetails;
