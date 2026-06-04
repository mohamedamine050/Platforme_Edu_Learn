import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { status } = useAuth();

  if (status === "loading") return <span aria-live="polite">Chargement...</span>;
  if (status === "unauthenticated") return <Navigate to="/signin" replace />;
  return <Outlet />;
};

export default PrivateRoute;
