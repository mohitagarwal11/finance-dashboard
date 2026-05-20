import { Navigate, Outlet } from "react-router-dom";

import FullPageLoader from "../components/FullPageLoader.jsx";
import { TransactionsProvider } from "../contexts/TransactionsContext.jsx";
import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader label="Restoring session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <TransactionsProvider>
      <Outlet />
    </TransactionsProvider>
  );
}

export default ProtectedRoute;
