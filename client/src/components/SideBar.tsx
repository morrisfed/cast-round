import { Permission, UserProfile } from "interfaces/user";
import { Link } from "react-router-dom";

export interface SideBarProps {
  profile: UserProfile;
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

const SideBar: React.FC<SideBarProps> = ({ profile }) => {
  return (
    <ul className="menu w-80 bg-base-100 p-4 text-base-content">
      {showAccounts(profile) ? (
        <li>
          <Link to="/accounts">Accounts</Link>
        </li>
      ) : null}
      {showDelegates(profile) ? (
        <li>
          <Link to="/delegates">Delegates</Link>
        </li>
      ) : null}
      <li>
        <a>Sidebar Item 1</a>
      </li>
      <li>
        <a>Sidebar Item 2</a>
      </li>
    </ul>
  );
};

export default SideBar;
