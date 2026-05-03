import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { me } from "../service/auth";

const PrivateRoute = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    me()
      .then(() => { if (!cancelled) setStatus("authenticated"); })
      .catch(() => { if (!cancelled) setStatus("unauthenticated"); });
    return () => { cancelled = true; };
  }, []);

  if (status === "loading") return <span aria-live="polite">Chargement...</span>;
  if (status === "unauthenticated") return <Navigate to="/signin" replace />;
  return <Outlet />;
};

export default PrivateRoute;
