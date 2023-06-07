import * as O from "fp-ts/lib/Option";

import EventItem from "components/Event/EventItem";
import { useUserProfile } from "components/UserProfileContext";
import VoteList from "components/Vote/VoteList";
import { EventWithVotes } from "interfaces/event";
import { showNewVoteButton } from "profile/functionality";
import { Form, Link } from "react-router-dom";
import { EventGroupDelegate } from "interfaces/delegates";

interface EventViewProps {
  event: EventWithVotes;
  delegateO: O.Option<EventGroupDelegate>;
  showDelegate: boolean;
}

const EventView: React.FC<EventViewProps> = ({
  event,
  delegateO,
  showDelegate,
}) => {
  const profile = useUserProfile();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row">
        <EventItem event={event} showEventDescription={true} />
        {showDelegate ? (
          <div>
            {O.isSome(delegateO) ? (
              <div>
                <h1>Delegate exists: {delegateO.value.label}</h1>
              </div>
            ) : (
              <div>
                <h1>No delegate exists</h1>
                <Form method="POST">
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Delegate label</span>
                    </label>
                    <input
                      name="label"
                      type="text"
                      placeholder="Label"
                      className="input-bordered input w-full max-w-xs"
                    />
                    <button
                      type="submit"
                      className="btn-outline btn-accent btn"
                    >
                      Create delegate
                    </button>
                  </div>
                </Form>
              </div>
            )}
          </div>
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
