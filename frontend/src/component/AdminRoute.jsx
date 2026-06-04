import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { status, user } = useAuth();

  if (status === "loading") return <span aria-live="polite">Chargement...</span>;
  if (status !== "authenticated" || user?.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
