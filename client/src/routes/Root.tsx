import Breadcrumbs from "components/Breadcrumbs";
import Navbar from "components/Navbar";
import SideBar from "components/SideBar";
import { UserProfile } from "interfaces/user";
import { useCallback, useRef } from "react";
import { Outlet } from "react-router-dom";

export interface RootProps {
  profile: UserProfile;
}

const Root: React.FC<RootProps> = ({ profile }) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const onSideBarItemSelected = useCallback(() => {
    checkboxRef.current?.click();
  }, [checkboxRef]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-none">
        <Navbar profile={profile} menuToggleId="my-drawer-2" />
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
          <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <SideBar profile={profile} itemSelected={onSideBarItemSelected} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
