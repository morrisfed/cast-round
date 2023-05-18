import { Permission, UserProfile } from "interfaces/user";
import { NavLink } from "react-router-dom";

export interface SideBarProps {
  profile: UserProfile;
  itemSelected: () => void;
}

const hasPermission = (profile: UserProfile, permission: Permission) => {
  return profile.permissions.includes(permission);
};

const showAccounts = (profile: UserProfile) =>
  hasPermission(profile, "ACCOUNTS_READ_ALL") ||
  hasPermission(profile, "ACCOUNTS_WRITE_ALL");

const showDelegates = (profile: UserProfile) =>
  hasPermission(profile, "DELEGATES_READ_ALL") ||
  hasPermission(profile, "DELEGATES_WRITE_ALL");

const showEvents = (profile: UserProfile) =>
  hasPermission(profile, "EVENTS_READ_ALL") ||
  hasPermission(profile, "EVENTS_WRITE_ALL");

const showAdmin = (profile: UserProfile) =>
  hasPermission(profile, "ADMINISTRATOR");

const SideBar: React.FC<SideBarProps> = ({ profile, itemSelected }) => {
  return (
    <ul className="menu w-80 bg-base-100 p-4 text-base-content">
      {showAdmin(profile) ? (
        <li>
          <NavLink to="/admin" onClick={itemSelected}>
            Admin
          </NavLink>
        </li>
      ) : null}
      {showAccounts(profile) ? (
        <li>
          <NavLink to="/accounts" onClick={itemSelected}>
            Accounts
          </NavLink>
        </li>
      ) : null}
      {showDelegates(profile) ? (
        <li>
          <NavLink to="/delegates" onClick={itemSelected}>
            Delegates
          </NavLink>
        </li>
      ) : null}
      {showEvents(profile) ? (
        <li>
          <NavLink to="/events" onClick={itemSelected}>
            Events
          </NavLink>
        </li>
      ) : null}
    </ul>
  );
};

export default SideBar;
