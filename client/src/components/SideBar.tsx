import { showAccounts, showAdmin, showEvents } from "profile/functionality";
import { NavLink } from "react-router-dom";
import { useUserProfile } from "./UserProfileContext";

export interface SideBarProps {
  itemSelected: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ itemSelected }) => {
  const profile = useUserProfile();

  return (
    <ul className="menu w-80 bg-base-100 p-4 text-base-content">
      {showAdmin(profile) ? (
        <li>
          <NavLink to="/admin" onClick={itemSelected}>
            Admin
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

      {showAccounts(profile) ? (
        <li>
          <NavLink to="/accounts" onClick={itemSelected}>
            Accounts
          </NavLink>
        </li>
      ) : null}
    </ul>
  );
};

export default SideBar;
