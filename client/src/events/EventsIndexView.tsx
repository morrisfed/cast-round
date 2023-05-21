import EventList from "components/Event/EventList";
import { Event } from "interfaces/event";
import { Link } from "react-router-dom";

interface EventsIndexViewProps {
  events: readonly Event[];
}

const EventsIndexView: React.FC<EventsIndexViewProps> = ({ events }) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <Link to="newevent" className="btn-primary btn">
        New event
      </Link>
      <EventList events={events} showEventDescription={false} />
    </div>
  );
};

export default EventsIndexView;
