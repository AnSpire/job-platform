import React, { useEffect, useMemo, useState } from "react";
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

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
          if (list.length > 0) {
            setSelectedUserId(list[0].id);
          }
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

  useEffect(() => {
    if (selectedUserId === null) {
      setSelectedUser(null);
      setDetailsError("");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setDetailsLoading(true);
        setDetailsError("");
        const resp = await api.get(`/users/${selectedUserId}`);
        if (!cancelled) {
          setSelectedUser(resp.data as User);
        }
      } catch {
        if (!cancelled) {
          setSelectedUser(null);
          setDetailsError("Не удалось загрузить детали пользователя.");
        }
      } finally {
        if (!cancelled) {
          setDetailsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedUserId]);

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
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name || "-"}</td>
                  <td>{user.last_name || "-"}</td>
                  <td>{user.role || "-"}</td>
                  <td>{user.employer_id ?? "-"}</td>
                  <td>{user.student_id ?? "-"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p className="text-muted mb-0">Пользователи с выбранной ролью не найдены.</p>
          )}
        </div>
      )}

      {!loading && !error && (
        <div className="card mt-4">
          <div className="card-body">
            <h2 className="h5 mb-3">Подробный просмотр пользователя</h2>

            {detailsLoading && <p className="text-muted mb-0">Загрузка деталей...</p>}
            {detailsError && <div className="alert alert-danger mb-0">{detailsError}</div>}

            {!detailsLoading && !detailsError && !selectedUser && (
              <p className="text-muted mb-0">Выберите пользователя для просмотра деталей.</p>
            )}

            {!detailsLoading && !detailsError && selectedUser && (
              <div className="d-flex flex-column gap-2">
                <div><strong>ID:</strong> {selectedUser.id}</div>
                <div><strong>Email:</strong> {selectedUser.email}</div>
                <div><strong>Имя:</strong> {selectedUser.first_name || "-"}</div>
                <div><strong>Фамилия:</strong> {selectedUser.last_name || "-"}</div>
                <div><strong>Роль:</strong> {selectedUser.role || "-"}</div>
                <div><strong>Employer ID:</strong> {selectedUser.employer_id ?? "-"}</div>
                <div><strong>Student ID:</strong> {selectedUser.student_id ?? "-"}</div>

                {selectedUser.role === "employer" && (
                  <div className="pt-2">
                    <button type="button" className="btn btn-outline-secondary">
                      Присвоить компанию
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
