import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Protected({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Загрузка...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/forbidden" replace />;

  return <>{children}</>;
}
