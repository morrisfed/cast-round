import * as O from "fp-ts/lib/Option";

import { useUserProfileLoading } from "./UserProfileLoadingContext";
import Welcome from "./Welcome";
import Spinner from "./Spinner";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { UserProfileContextProvider } from "./UserProfileContext";

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
      <AuthenticatedLayout />
    </UserProfileContextProvider>
  );
}

export default Layout;
