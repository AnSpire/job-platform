import {useAuth} from "../auth/AuthContext";

export default function UserProfilePage() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Профиль</h1>
      <p>Email: {user.email}</p>
      <p>Имя: {user.first_name}</p>
      <p>Фамилия: {user.last_name}</p>
    </div>
  );
}
