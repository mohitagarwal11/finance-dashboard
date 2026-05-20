import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicOnlyRoute from "./routes/PublicOnlyRoute.jsx";
import FullPageLoader from "./components/FullPageLoader.jsx";

const AuthPage = lazy(() => import("./pages/AuthPage"));
const SettingsPageContainer = lazy(
  () => import("./pages/SettingsPageContainer.jsx"),
);
const DashboardPageContainer = lazy(
  () => import("./pages/DashboardPageContainer.jsx"),
);

function App() {
  return (
    <Suspense fallback={<FullPageLoader label="Loading page" />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<AuthPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPageContainer />} />
          <Route path="/settings" element={<SettingsPageContainer />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
