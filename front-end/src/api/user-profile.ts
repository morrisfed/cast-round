import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios from "axios";
import { Role, UserProfile } from "interfaces/user";
import { FrontEndFeatureFlags } from "interfaces/features";

interface ProfileResponse {
  profile: {
    id: string;
    name: string;
    roles: Role[];
  };
  frontEndFeatureFlags: Record<
    "feature.ui.eventgroupdelegates" | "feature.ui.eventtellors",
    boolean
  >;
}

const retrieveProfile = (): TE.TaskEither<Error, ProfileResponse> =>
  pipe(
    TE.tryCatch(
      () => axios.get<ProfileResponse>("/api/profile"),
      (reason) => new Error(`${reason}`)
    ),
    TE.map((response) => response.data)
  );

const getUserProfile = (): TE.TaskEither<
  Error,
  [UserProfile, FrontEndFeatureFlags]
> =>
  pipe(
    retrieveProfile(),
    TE.map((profileResponse) => [
      profileResponse.profile,
      profileResponse.frontEndFeatureFlags,
    ])
  );

export default getUserProfile;
