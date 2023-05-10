import React, { useCallback, useContext, useEffect, useState } from "react";

import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { UserProfile } from "interfaces/user";
import getUserProfile from "api/user-profile";
import { pipe } from "fp-ts/lib/function";

/**
 * Provides the user profile for the application by retrieving it from the server api. The API will return profile
 * information according to the currently authenticated user.
 */

export type IUserProfileContext = {
  loading: boolean;
  userProfile: O.Option<UserProfile>;
};

const UserProfileContext = React.createContext<IUserProfileContext>({
  loading: true,
  userProfile: O.none,
});

const UserProfileContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [userProfile, setUserProfile] = useState<O.Option<UserProfile>>(O.none);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const getUserProfileTask = pipe(
      getUserProfile(),

      TE.fold(
        () => {
          setUserProfile(O.none);
          return T.of(setLoading(false));
        },
        (profile) => {
          setUserProfile(O.some(profile));
          return T.of(setLoading(false));
        }
      )
    );

    await getUserProfileTask();
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <UserProfileContext.Provider
      value={{
        loading: loading,
        userProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

const useUserProfile = () => useContext(UserProfileContext);

export { UserProfileContextProvider, useUserProfile };
