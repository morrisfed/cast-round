import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";

import { useCallback, useEffect, useMemo, useState } from "react";

import { EventClerk } from "interfaces/clerks";
import { showEventClerks } from "profile/functionality";

import { useUserProfile } from "components/UserProfileContext";
import Spinner from "components/Spinner";
import EventClerksView from "./EventClerksView";

export interface EventClerksControllerProps {
  getClerks: () => TE.TaskEither<Error | "not-found", readonly EventClerk[]>;
  createClerk: (
    label: string
  ) => TE.TaskEither<Error | "forbidden" | "not-found", EventClerk>;
  deleteClerk: (
    clerkId: string
  ) => TE.TaskEither<Error | "forbidden" | "not-found", unknown>;
}

const EventClerksController: React.FC<EventClerksControllerProps> = ({
  getClerks,
  createClerk,
  deleteClerk,
}) => {
  const profile = useUserProfile();

  const [clerks, setClerks] = useState<readonly EventClerk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const showClerksView = useMemo(() => showEventClerks(profile), [profile]);

  const onRefreshHandler = useCallback(async () => {
    setLoading(true);
    setError(false);
    const getClerksTask = getClerks();
    const result = await getClerksTask();

    if (E.isLeft(result)) {
      setError(true);
    } else {
      setClerks(result.right);
    }
    setLoading(false);
  }, [getClerks]);

  const onCopyLinkHandler = useCallback((clerk: EventClerk) => {
    navigator.clipboard.writeText(clerk.clerkUserLoginUrl);
  }, []);

  const onRemoveClerkHandler = useCallback(
    async (clerk: EventClerk) => {
      setLoading(true);
      setError(false);

      const deleteTask = deleteClerk(clerk.clerkUserId);
      const result = await deleteTask();

      if (E.isLeft(result)) {
        setError(true);
      } else {
        setClerks(clerks.filter((c) => c.clerkUserId !== clerk.clerkUserId));
      }

      setLoading(false);
    },
    [clerks, deleteClerk]
  );

  const onCreateClerkHandler = useCallback(
    async (label: string) => {
      setLoading(true);
      setError(false);

      const createClerkTask = createClerk(label);
      const result = await createClerkTask();

      if (E.isLeft(result)) {
        setError(true);
      } else {
        setClerks(clerks.concat([result.right]));
      }

      setLoading(false);
    },
    [clerks, createClerk]
  );

  useEffect(() => {
    if (showClerksView) {
      onRefreshHandler();
    }
  }, [showClerksView, onRefreshHandler]);

  if (!showClerksView) {
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div>
        <p>
          An error has occured while loading your event event clerk information.
        </p>
        <p>Please tap refresh to try again.</p>
        <button className="btn-primary btn" onClick={() => onRefreshHandler()}>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <>
      <EventClerksView
        clerks={clerks}
        onCopyLink={onCopyLinkHandler}
        onCreateClerk={onCreateClerkHandler}
        onRemoveClerk={onRemoveClerkHandler}
      />
    </>
  );
};

export default EventClerksController;
