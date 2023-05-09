import React, { useMemo } from "react";
import { UserProfile } from "interfaces/user";
import Profile from "./Profile";

export interface NavbarProps {
  profile: UserProfile;
  menuToggleId?: string;
}

const Navbar: React.FC<NavbarProps> = ({ profile, menuToggleId }) => {
  return (
    <div className="navbar bg-black/20">
      <label
        htmlFor={menuToggleId}
        tabIndex={0}
        className="btn-ghost drawer-button btn-circle btn lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16M4"
          />
        </svg>
      </label>

      <div className="flex-1">
        <p className="text-xl normal-case">Cast Round</p>
      </div>
      <div className="flex-none">
        <div>
          <Profile profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
