import Breadcrumbs from "components/Breadcrumbs";
import Navbar from "components/Navbar";
import SideBar from "components/SideBar";
import { useUserProfile } from "components/UserProfileContext";
import { useEvents } from "events/EventsContext";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Root: React.FC = () => {
  const profile = useUserProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const events = useEvents();
  const checkboxRef = useRef<HTMLInputElement>(null);

  const onSideBarItemSelected = useCallback(() => {
    checkboxRef.current?.click();
  }, [checkboxRef]);

  const useSideBar = useMemo(() => {
    // Do not display the sidebar for group delegates, tellors or clerks.
    // Always display the sidebar for committee members.
    // In other cases, only show the sidebar if there is more than one event.

    if (
      profile.roles.includes("GROUP_DELEGATE") ||
      profile.roles.includes("TELLOR") ||
      profile.roles.includes("VOTING_CLERK")
    ) {
      return false;
    }

    if (profile.roles.includes("COMMITTEE")) {
      return true;
    }

    return events.length > 1;
  }, [events.length, profile.roles]);

  // Apply any redirection if necessary according to the user's role.
  useEffect(() => {
    if (profile.roles.includes("GROUP_DELEGATE")) {
      // Ensure the route is related to the delegate's assigned event.
      if (
        !location.pathname.startsWith(
          `/events/${profile.groupDelegateInfo?.delegateForEventId}`
        )
      ) {
        navigate(`/events/${profile.groupDelegateInfo?.delegateForEventId}`);
      }
    } else if (profile.roles.includes("TELLOR")) {
      // Ensure the route is related to the tellor's assigned event.
      if (
        !location.pathname.startsWith(
          `/events/${profile.tellorInfo?.tellorForEventId}`
        )
      ) {
        navigate(`/events/${profile.tellorInfo?.tellorForEventId}`);
      }
    } else if (profile.roles.includes("VOTING_CLERK")) {
      // Ensure the route is related to the clerk's assigned event.
      if (
        !location.pathname.startsWith(
          `/events/${profile.clerkInfo?.clerkForEventId}`
        )
      ) {
        navigate(`/events/${profile.clerkInfo?.clerkForEventId}`);
      }
    } else if (profile.roles.includes("VOTER")) {
      // Voters can only access the /events route. If only one event is available, redirect to it.
      if (
        events.length === 1 &&
        !location.pathname.startsWith(`/events/${events[0].id}`)
      ) {
        navigate(`/events/${events[0].id}`);
      } else if (!location.pathname.startsWith(`/events`)) {
        navigate("/events");
      }
    } else if (location.pathname === "/") {
      // Redirect to the /events route if currently pointing to the root.
      navigate("/events");
    }
  }, [profile, location, events, navigate]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-none">
        <Navbar menuToggleId={useSideBar ? "my-drawer-2" : undefined} />
      </div>
      <div className="grow">
        <div className="drawer-mobile drawer h-full ">
          <input
            ref={checkboxRef}
            id="my-drawer-2"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-content flex flex-col">
            <Breadcrumbs />
            <div className="p-2">
              <Outlet />
            </div>
          </div>
          {useSideBar ? (
            <div className="drawer-side">
              <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
              <SideBar itemSelected={onSideBarItemSelected} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Root;
