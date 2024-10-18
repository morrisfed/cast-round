import React from "react";
import { Link } from "react-router-dom";
import { Event } from "interfaces/event";

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

const EventListItemCard: React.FC<EventItemProps> = ({ event }) => {
  return (
    <Link to={`/events/${event.id}`}>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="truncate">
              <h2 className="card-title">{event.name}</h2>
              <p>Open: {datetimeFormatter.format(event.fromDate)}</p>
              <p>Close: {datetimeFormatter.format(event.toDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventListItemCard;
