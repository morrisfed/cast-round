import { CrumbDataFn } from "components/Crumb";
import { Outlet } from "react-router-dom";

export const AdminCrum: CrumbDataFn = () => {
  return { label: "Admin" };
};

const AdminRoute: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminRoute;
