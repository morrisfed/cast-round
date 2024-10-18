import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";

import { EventGroupDelegate } from "interfaces/delegates";
import { withAppFeatureFlag } from "components/AppFeatureFlagsContext";
import { useUserProfile } from "components/UserProfileContext";
import { showEventGroupDelegate } from "profile/functionality";
import {
  createEventGroupDelegate,
  deleteEventGroupDelegate,
  getEventGroupDelegate,
} from "./delegates-service";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "components/Spinner";
import EventGroupDelegateView from "./EventGroupDelegateView";

interface EventGroupDelegateControllerProps {
  eventId: number;
}

const EventGroupDelegateController: React.FC<
  EventGroupDelegateControllerProps
> = ({ eventId }) => {
  const profile = useUserProfile();

  const [delegateO, setDelegateO] = useState<O.Option<EventGroupDelegate>>(
    O.none
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const showDelegateView = useMemo(
    () => showEventGroupDelegate(profile),
    [profile]
  );

  const onRefreshHandler = useCallback(async () => {
    setLoading(true);
    setError(false);
    const getDelegateTask = getEventGroupDelegate(eventId);
    const result = await getDelegateTask();

    if (E.isLeft(result)) {
      if (result.left === "not-found") {
        setDelegateO(O.none);
      } else {
        setError(true);
      }
    } else {
      setDelegateO(O.some(result.right));
    }
    setLoading(false);
  }, [eventId]);

  const onCopyLinkHandler = useCallback(() => {
    if (O.isSome(delegateO)) {
      navigator.clipboard.writeText(delegateO.value.delegateUserLoginUrl);
    }
  }, [delegateO]);

  const onRemoveDelegateHandler = useCallback(() => {
    if (O.isSome(delegateO)) {
      const delegate = delegateO.value;
      const removeDelegateTask = deleteEventGroupDelegate(
        eventId,
        delegate.delegateForAccountUserId
      );
      removeDelegateTask().then((result) => {
        if (E.isLeft(result)) {
          setError(true);
        } else {
          setDelegateO(O.none);
        }
      });
    }
  }, [delegateO, eventId]);

  const onCreateDelegateHandler = useCallback(
    (label: string) => {
      const createDelegateTask = createEventGroupDelegate(
        eventId,
        label,
        profile.id
      );
      createDelegateTask().then((result) => {
        if (E.isLeft(result)) {
          setError(true);
        } else {
          setDelegateO(O.some(result.right));
        }
      });
    },
    [eventId, profile.id]
  );

  useEffect(() => {
    if (showDelegateView) {
      onRefreshHandler();
    }
  }, [showDelegateView, onRefreshHandler]);

  if (!showDelegateView) {
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div>
        <p>
          An error has occured while loading your event group delegate
          information.
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
      <EventGroupDelegateView
        eventGroupDelegateO={delegateO}
        onCopyLink={onCopyLinkHandler}
        onRemoveDelegate={onRemoveDelegateHandler}
        onCreateDelegate={onCreateDelegateHandler}
      />
    </>
  );
};

export default withAppFeatureFlag("feature.ui.eventgroupdelegates")(
  EventGroupDelegateController
);
