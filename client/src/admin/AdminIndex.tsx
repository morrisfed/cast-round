import { UserProfile } from "interfaces/user";
import { showAdminUploadUsers } from "profile/functionality";
import { Link } from "react-router-dom";

interface AdminIndexProps {
  profile: UserProfile;
}

const AdminIndex: React.FC<AdminIndexProps> = ({ profile }) => {
  return (
    <div>
      {showAdminUploadUsers(profile) ? (
        <Link to="uploadAccounts" className="btn-primary btn">
          Upload accounts
        </Link>
      ) : null}
    </div>
  );
};

export default AdminIndex;
