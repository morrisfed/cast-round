import { NavLinkProps } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";

const tabClassName: NavLinkProps["className"] = ({ isActive, isPending }) =>
  `tab-bordered tab ${isActive ? "tab-active" : ""} ${
    isPending ? "tab-active" : ""
  }`;

const Admin: React.FC = () => {
  return (
    <div>
      <div className="tabs">
        <NavLink to="" className={tabClassName} end>
          Admin Home
        </NavLink>
        <NavLink to="uploadAccounts" className={tabClassName} end>
          Upload Accounts
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Admin;
