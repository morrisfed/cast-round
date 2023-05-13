import React from "react";
import { Link } from "react-router-dom";
import { Event } from "interfaces/event";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export interface EventItemProps {
  event: Event;
  showEventDescription: boolean;
}

const EventItem: React.FC<EventItemProps> = ({
  event,
  showEventDescription,
}) => {
  return (
    <Link to={`/events/${event.id}`}>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="truncate">
              <h2 className="card-title">{event.name}</h2>
              <p>From: {event.fromDate.toString()}</p>
              <p>To: {event.toDate.toString()}</p>
              {showEventDescription ? (
                <article className="prose">
                  <ReactMarkdown>{event.description}</ReactMarkdown>
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventItem;
