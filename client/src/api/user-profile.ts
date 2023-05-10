import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios from "axios";
import { UserType, Permission } from "interfaces/user";

interface ProfileResponse {
  profile: {
    id: string;
    name: string;
    type: UserType;
    permissions: Permission[];
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

const getUserProfile = () =>
  pipe(
    retrieveProfile(),
    TE.map((profileResponse) => profileResponse.profile)
  );

export default getUserProfile;
