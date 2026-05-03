import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { me } from "../service/auth";

const PrivateRoute = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    me()
      .then(() => setStatus("authenticated"))
      .catch(() => setStatus("unauthenticated"));
  }, []);

  if (status === "loading") return null;
  if (status === "unauthenticated") return <Navigate to="/signin" replace />;
  return <Outlet />;
};

export default PrivateRoute;
