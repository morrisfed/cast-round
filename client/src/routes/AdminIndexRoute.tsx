import AdminIndex from "admin/AdminIndex";
import { UserProfile } from "interfaces/user";

interface AdminIndexRouteProps {
  profile: UserProfile;
}

const AdminIndexRoute: React.FC<AdminIndexRouteProps> = ({ profile }) => {
  return (
    <div>
      <AdminIndex profile={profile} />
    </div>
  );
};

export default AdminIndexRoute;
