import { useAuth } from "../auth/AuthContext";
import EmployerProfile from "../components/EmployerProfile";
import "./UserProfile.css";

export default function UserProfilePage() {
  const { user, updateProfile, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-wrapper content">
      {user.role === "employer" && (
        <EmployerProfile
          user={user}
          updateProfile={updateProfile}
          logout={logout}
        />
      )}

      {user.role === "student" && (
        <h2>Личный кабинет студента</h2>
        // позже вынесешь StudentProfile аналогично
      )}
    </div>
  );
}
