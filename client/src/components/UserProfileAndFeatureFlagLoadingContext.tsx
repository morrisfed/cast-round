import React, { useCallback, useContext, useEffect, useState } from "react";

import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { UserProfile } from "interfaces/user";
import getUserProfile from "api/user-profile";
import { pipe } from "fp-ts/lib/function";
import { FrontEndFeatureFlags } from "interfaces/features";

/**
 * Provides the user profile and feature flags for the application by retrieving them from the server api. The API will return profile
 * and feature flag information according to the currently authenticated user.
 */

export type IUserProfileAndFeatureFlagsLoadingContext = {
  loading: boolean;
  userProfile: O.Option<UserProfile>;
  featureFlags: O.Option<FrontEndFeatureFlags>;
};

const UserProfileAndFeatureFlagsLoadingContext =
  React.createContext<IUserProfileAndFeatureFlagsLoadingContext>({
    loading: true,
    userProfile: O.none,
    featureFlags: O.none,
  });

const UserProfileAndFeatureFlagsLoadingContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [userProfile, setUserProfile] = useState<O.Option<UserProfile>>(O.none);
  const [featureFlags, setFeatureFlags] = useState<
    O.Option<FrontEndFeatureFlags>
  >(O.none);
  const [loading, setLoading] = useState(false);

  const fetchProfileAndFeatureFlags = useCallback(async () => {
    setLoading(true);
    const getUserProfileTask = pipe(
      getUserProfile(),

      TE.fold(
        () => {
          setUserProfile(O.none);
          return T.of(setLoading(false));
        },
        ([profile, frontEndFeatureFlags]) => {
          setUserProfile(O.some(profile));
          setFeatureFlags(O.some(frontEndFeatureFlags));
          return T.of(setLoading(false));
        }
      )
    );

    await getUserProfileTask();
  }, []);

  useEffect(() => {
    fetchProfileAndFeatureFlags();
  }, [fetchProfileAndFeatureFlags]);

  return (
    <UserProfileAndFeatureFlagsLoadingContext.Provider
      value={{
        loading: loading,
        userProfile,
        featureFlags,
      }}
    >
      {children}
    </UserProfileAndFeatureFlagsLoadingContext.Provider>
  );
};

const useUserProfileAndFeatureFlagsLoading = () =>
  useContext(UserProfileAndFeatureFlagsLoadingContext);

export {
  UserProfileAndFeatureFlagsLoadingContextProvider as UserProfileAndFeatureFlagLoadingContextProvider,
  useUserProfileAndFeatureFlagsLoading,
};
