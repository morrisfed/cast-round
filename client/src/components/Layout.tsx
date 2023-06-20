import * as O from "fp-ts/lib/Option";

import { useUserProfileLoading } from "./UserProfileLoadingContext";
import Welcome from "./Welcome";
import Spinner from "./Spinner";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { UserProfileContextProvider } from "./UserProfileContext";
import { EventsContextProvider } from "events/EventsContext";

function Layout() {
  const { loading: loadingProfile, userProfile } = useUserProfileLoading();

  if (loadingProfile) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (O.isNone(userProfile)) {
    return <Welcome />;
  }

  return (
    <UserProfileContextProvider userProfile={userProfile.value}>
      <EventsContextProvider>
        <AuthenticatedLayout />
      </EventsContextProvider>
    </UserProfileContextProvider>
  );
}

export default Layout;
