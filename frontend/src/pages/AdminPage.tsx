import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

type User = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  employer_id: number | null;
  student_id: number | null;
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const resp = await api.get("/users/");
        if (!cancelled) {
          const list = Array.isArray(resp.data) ? (resp.data as User[]) : [];
          setUsers(list);
        }
      } catch {
        if (!cancelled) {
          setError("Не удалось загрузить пользователей.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((user) => user.role === roleFilter);
  }, [users, roleFilter]);

  return (
    <section className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 className="h3 mb-0">Admin</h1>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="role-filter" className="form-label mb-0">
            Роль:
          </label>
          <select
            id="role-filter"
            className="form-select"
            style={{ width: "180px" }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="employer">Employer</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-muted">Загрузка пользователей...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Роль</th>
                <th>Employer ID</th>
                <th>Student ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  role="button"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name || "-"}</td>
                  <td>{user.last_name || "-"}</td>
                  <td>{user.role || "-"}</td>
                  <td>{user.employer_id ?? "-"}</td>
                  <td>{user.student_id ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p className="text-muted mb-0">Пользователи с выбранной ролью не найдены.</p>
          )}
        </div>
      )}
    </section>
  );
}
