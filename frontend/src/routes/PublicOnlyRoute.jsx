import { Navigate, Outlet } from "react-router-dom";

import FullPageLoader from "../components/FullPageLoader.jsx";
import { useAuth } from "../hooks/useAuth.js";

function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader label="Restoring session" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
