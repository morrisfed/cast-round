import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import { Event } from "interfaces/event";

export interface EventTableProps {
  events: readonly Event[];
}

const EventTable: React.FC<EventTableProps> = ({ events }) => {
  const items = useMemo(() => {
    return events.map((event) => {
      return (
        <tr key={event.id}>
          <td>
            <div className="max-w-xs truncate whitespace-normal font-bold">
              {event.name}
            </div>
          </td>
          <td>{event.fromDate.toString()}</td>
          <td>{event.toDate.toString()}</td>
          <td>
            <Link to={"/events/" + event.id} className="btn">
              View
            </Link>
          </td>
        </tr>
      );
    });
  }, [events]);

  return (
    <div className="">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
    </div>
  );
};

export default EventTable;
