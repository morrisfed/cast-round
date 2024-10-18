import { useUserProfile } from "components/UserProfileContext";
import { showAdminUploadUsers } from "profile/functionality";
import { Link } from "react-router-dom";

const AdminIndex: React.FC = () => {
  const profile = useUserProfile();

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
