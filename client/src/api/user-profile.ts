import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios from "axios";
import { Role, UserProfile } from "interfaces/user";

interface ProfileResponse {
  profile: {
    id: string;
    name: string;
    roles: Role[];
  };
}

const retrieveProfile = (): TE.TaskEither<Error, ProfileResponse> =>
  pipe(
    TE.tryCatch(
      () => axios.get<ProfileResponse>("/api/profile"),
      (reason) => new Error(`${reason}`)
    ),
    TE.map((response) => response.data)
  );

const getUserProfile = (): TE.TaskEither<Error, UserProfile> =>
  pipe(
    retrieveProfile(),
    TE.map((profileResponse) => profileResponse.profile)
  );

export default getUserProfile;
