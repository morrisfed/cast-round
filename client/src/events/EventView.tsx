import EventDetails from "components/Event/EventDetails";
import { useUserProfile } from "components/UserProfileContext";
import MotionList from "components/Motion/MotionList";
import { EventWithMotions } from "interfaces/event";
import { showNewMotionButton } from "profile/functionality";
import { Link } from "react-router-dom";
import { EventTellor } from "interfaces/tellors";
import EventTellorsView from "tellors/TellorView";
import EventGroupDelegateController from "delegates/EventGroupDelegateController";
import EventClerksController, {
  EventClerksControllerProps,
} from "components/Clerk/EventClerkController";

interface EventViewProps {
  event: EventWithMotions;
  showEventGroupDelegate: boolean;
  eventTellors: readonly EventTellor[];
  showEventTellors: boolean;
  showEventClerks: boolean;
  clerksControllerProps: EventClerksControllerProps;
  refreshHandler: (eventId: number) => void;
}

const EventView: React.FC<EventViewProps> = ({
  event,
  showEventGroupDelegate,
  eventTellors,
  showEventTellors,
  showEventClerks,
  clerksControllerProps,
  refreshHandler,
}) => {
  const profile = useUserProfile();

  return (
    <>
      <button className="btn" onClick={() => refreshHandler(event.id)}>
        Refresh
      </button>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="md:col-span-2">
            <EventDetails event={event} />
          </div>
          {showEventGroupDelegate ? (
            <EventGroupDelegateController eventId={event.id} />
          ) : null}
          {showEventTellors ? (
            <EventTellorsView eventTellors={eventTellors} />
          ) : null}
          {showEventClerks ? (
            <EventClerksController {...clerksControllerProps} />
          ) : null}
        </div>

        <div className="divider divider-vertical" />

        <div className="flex flex-col gap-2 p-2">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold">Motions</h2>
            {showNewMotionButton(profile) ? (
              <Link to={`new`} className="btn-primary btn">
                Add motion
              </Link>
            ) : null}
          </div>

          <MotionList motions={event.motions} />
        </div>
      </div>
    </>
  );
};

export default EventView;
