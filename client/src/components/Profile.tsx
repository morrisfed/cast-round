import React from "react";
import { UserProfile } from "interfaces/user";

export interface ProfileProps {
  profile: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  // get initials for user from profile.name string with a maximum of 2 letters
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div>
      <div tabIndex={0} className="dropdown-end placeholder dropdown avatar">
        <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
          <span className="text-xl">{initials}</span>
        </div>
        <div
          tabIndex={0}
          className="card dropdown-content card-compact mt-3 w-52 bg-base-100 shadow"
        >
          <div className="card-body">
            <span className="text-lg font-bold">{profile.name}</span>
            <span className="text-info">{profile.roles.join(" ")}</span>
            <div className="card-actions">
              <form action="/api/auth/logout" method="post">
                <button className="btn-primary btn-block btn" type="submit">
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
