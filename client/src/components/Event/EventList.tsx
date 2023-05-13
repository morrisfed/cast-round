import React, { useMemo } from "react";
import { Event } from "interfaces/event";
import EventItem from "./EventItem";

export interface EventListProps {
  events: readonly Event[];
  showEventDescription: boolean;
}

const EventList: React.FC<EventListProps> = ({
  events,
  showEventDescription,
}) => {
  const items = useMemo(() => {
    return events.map((event) => {
      return (
        <div key={event.id} className="grow sm:w-80">
          <EventItem
            event={event}
            showEventDescription={showEventDescription}
          />
        </div>
      );
    });
  }, [events, showEventDescription]);

  return <div className="flex flex-row flex-wrap gap-2">{items}</div>;
};

export default EventList;
