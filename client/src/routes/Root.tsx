import Navbar from "components/Navbar";
import SideBar from "components/SideBar";
import { UserProfile } from "interfaces/user";
import { Outlet } from "react-router-dom";

export interface RootProps {
  profile: UserProfile;
}

const Root: React.FC<RootProps> = ({ profile }) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-none">
        <Navbar profile={profile} menuToggleId="my-drawer-2" />
      </div>
      <div className="grow">
        <div className="drawer-mobile drawer h-full ">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col p-2 ">
            <Outlet />
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <SideBar profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
