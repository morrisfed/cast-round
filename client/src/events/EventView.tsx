import EventItem from "components/Event/EventItem";
import VoteList from "components/Vote/VoteList";
import { EventWithVotes } from "interfaces/event";
import { Link } from "react-router-dom";

interface EventViewProps {
  event: EventWithVotes;
}

const EventView: React.FC<EventViewProps> = ({ event }) => {
  return (
    <div className="flex flex-col gap-2">
      <EventItem event={event} showEventDescription={true} />

      <div className="divider divider-vertical" />

      <div className="flex flex-col gap-2 p-2">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold">Votes</h2>
          <Link
            to={`/events/${event.id}/votes/newvote`}
            className="btn-primary btn"
          >
            Add vote
          </Link>
        </div>

        <VoteList
          eventId={event.id}
          votes={event.votes}
          showVoteDescription={false}
        />
      </div>
    </div>
  );
};

export default EventView;
