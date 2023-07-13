import * as O from "fp-ts/lib/Option";

import EventItem from "components/Event/EventItem";
import { useUserProfile } from "components/UserProfileContext";
import MotionList from "components/Motion/MotionList";
import { EventWithMotions } from "interfaces/event";
import { showNewVoteButton } from "profile/functionality";
import { Link } from "react-router-dom";
import { EventGroupDelegate } from "interfaces/delegates";
import EventGroupDelegateView from "delegates/EventGroupDelegateView";
import { EventTellor } from "interfaces/tellors";
import EventTellorsView from "tellors/TellorView";

interface EventViewProps {
  event: EventWithMotions;
  eventGroupDelegateO: O.Option<EventGroupDelegate>;
  showEventGroupDelegate: boolean;
  eventTellors: readonly EventTellor[];
  showEventTellors: boolean;
}

const EventView: React.FC<EventViewProps> = ({
  event,
  eventGroupDelegateO,
  showEventGroupDelegate,
  eventTellors,
  showEventTellors,
}) => {
  const profile = useUserProfile();

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <EventItem event={event} showEventDescription={true} />
        {showEventGroupDelegate ? (
          <EventGroupDelegateView eventGroupDelegateO={eventGroupDelegateO} />
        ) : null}
        {showEventTellors ? (
          <EventTellorsView eventTellors={eventTellors} />
        ) : null}
      </div>

      <div className="divider divider-vertical" />

      <div className="flex flex-col gap-2 p-2">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold">Votes</h2>
          {showNewVoteButton(profile) ? (
            <Link
              to={`/events/${event.id}/votes/newvote`}
              className="btn-primary btn"
            >
              Add vote
            </Link>
          ) : null}
        </div>

        <MotionList
          eventId={event.id}
          motions={event.motions}
          showMotionDescription={false}
        />
      </div>
    </div>
  );
};

export default EventView;
