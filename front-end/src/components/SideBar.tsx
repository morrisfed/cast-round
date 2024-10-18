import { showAccounts, showAdmin, showEvents } from "profile/functionality";
import { NavLink } from "react-router-dom";
import { useUserProfile } from "./UserProfileContext";
import { useEvents } from "events/EventsContext";

export interface SideBarProps {
  itemSelected: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ itemSelected }) => {
  const profile = useUserProfile();
  const events = useEvents();

  return (
    <ul className="menu w-80 bg-base-100 p-4 text-base-content">
      {showAdmin(profile) ? (
        <li className="my-1">
          <NavLink to="/admin" onClick={itemSelected}>
            Admin
          </NavLink>
        </li>
      ) : null}

      {showEvents(profile) ? (
        <>
          <li className="my-1">
            <NavLink to="/events" onClick={itemSelected}>
              Events
            </NavLink>
          </li>
          {events.length > 0 ? (
            <li className="my-1 ml-8">
              <NavLink to={`/events/${events[0].id}`} onClick={itemSelected}>
                {events[0].name}
              </NavLink>
            </li>
          ) : null}
          {events.length > 1 ? (
            <li className="my-1 ml-8">
              <NavLink to={`/events/${events[1].id}`} onClick={itemSelected}>
                {events[1].name}
              </NavLink>
            </li>
          ) : null}
        </>
      ) : null}

      {showAccounts(profile) ? (
        <li className="my-1">
          <NavLink to="/accounts" onClick={itemSelected}>
            Accounts
          </NavLink>
        </li>
      ) : null}
    </ul>
  );
};

export default SideBar;
