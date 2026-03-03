import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

export default function AdminUserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("Не указан ID пользователя.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const resp = await api.get(`/users/${userId}`);
        if (!cancelled) {
          setUser(resp.data as User);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setError("Не удалось загрузить пользователя.");
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
  }, [userId]);

  return (
    <section className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Пользователь</h1>
        <Link to="/admin" className="btn btn-outline-secondary">
          К списку
        </Link>
      </div>

      {loading && <p className="text-muted">Загрузка пользователя...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && user && (
        <div className="card">
          <div className="card-body d-flex flex-column gap-2">
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Имя:</strong> {user.first_name || "-"}</div>
            <div><strong>Фамилия:</strong> {user.last_name || "-"}</div>
            <div><strong>Роль:</strong> {user.role || "-"}</div>
            <div><strong>Employer ID:</strong> {user.employer_id ?? "-"}</div>
            <div><strong>Student ID:</strong> {user.student_id ?? "-"}</div>

            {user.role === "employer" && (
              <div className="pt-2">
                <button type="button" className="btn btn-outline-primary">
                  Присвоить компанию
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
