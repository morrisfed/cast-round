import EventList from "components/Event/EventList";
import { Event } from "interfaces/event";
import { Link } from "react-router-dom";

interface EventsIndexViewProps {
  events: readonly Event[];
  refreshHandler: () => void;
}

const EventsIndexView: React.FC<EventsIndexViewProps> = ({
  events,
  refreshHandler,
}) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex flex-row gap-2">
          <Link to="newevent" className="btn-primary btn">
            New event
          </Link>
          <button className="btn" onClick={() => refreshHandler()}>
            Refresh
          </button>
        </div>
      </div>
      <EventList events={events} showEventDescription={false} />
    </div>
  );
};

export default EventsIndexView;
