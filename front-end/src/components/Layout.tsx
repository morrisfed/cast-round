import * as O from "fp-ts/lib/Option";

import { useUserProfileAndFeatureFlagsLoading } from "./UserProfileAndFeatureFlagLoadingContext";
import Welcome from "./Welcome";
import Spinner from "./Spinner";
import AuthenticatedRouter from "../routes/AuthenticatedRouter";
import { UserProfileContextProvider } from "./UserProfileContext";
import { EventsContextProvider } from "events/EventsContext";
import { AppFeatureFlagsProvider } from "./AppFeatureFlagsContext";

function Layout() {
  const {
    loading: loadingProfile,
    userProfile,
    featureFlags,
  } = useUserProfileAndFeatureFlagsLoading();

  if (loadingProfile) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (O.isNone(userProfile) || O.isNone(featureFlags)) {
    return <Welcome />;
  }

  return (
    <AppFeatureFlagsProvider frontEndFeatureFlags={featureFlags.value}>
      <UserProfileContextProvider userProfile={userProfile.value}>
        <EventsContextProvider>
          <AuthenticatedRouter />
        </EventsContextProvider>
      </UserProfileContextProvider>
    </AppFeatureFlagsProvider>
  );
}

export default Layout;
