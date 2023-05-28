import EventList from "components/Event/EventList";
import { Event } from "interfaces/event";
import { Link } from "react-router-dom";

interface EventsIndexViewProps {
  events: readonly Event[];
}

const EventsIndexView: React.FC<EventsIndexViewProps> = ({ events }) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link to="newevent" className="btn-primary btn">
          New event
        </Link>
      </div>
      <EventList events={events} showEventDescription={false} />
    </div>
  );
};

export default EventsIndexView;
