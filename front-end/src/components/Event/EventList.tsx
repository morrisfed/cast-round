import React, { useMemo } from "react";
import { Event } from "interfaces/event";
import EventListItemCard from "./EventListItemCard";

export interface EventListProps {
  events: readonly Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const items = useMemo(() => {
    return events.map((event) => {
      return (
        <div key={event.id} className="grow sm:w-80">
          <EventListItemCard event={event} />
        </div>
      );
    });
  }, [events]);

  return <div className="flex flex-row flex-wrap gap-2">{items}</div>;
};

export default EventList;
