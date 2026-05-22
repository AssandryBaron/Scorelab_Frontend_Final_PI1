import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import PrivateRoute from "./router/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardOrganizadorPage from "./pages/DashboardOrganizadorPage";
import DashboardDelegadoPage from "./pages/DashboardDelegadoPage";
import SpectatorDashboard from "./pages/SpectatorDashboard";
import MatchManager from "./components/organisms/MatchControl/MatchManager";

const MatchControlWrapper = () => {
  const { partidoId } = useParams();
  return <MatchManager partidoId={partidoId} />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* ── Rutas Públicas ──────────────────────────────────────── */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/espectador" element={<SpectatorDashboard />} />

      {/* ── Organizador ─────────────────────────────────────────── */}
      <Route
        path="/dashboard-organizador"
        element={
          <PrivateRoute allowedRoles={["ORGANIZADOR"]}>
            <DashboardOrganizadorPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/control-partido/:partidoId"
        element={
          <PrivateRoute allowedRoles={["ORGANIZADOR"]}>
            <div className="min-h-screen bg-slate-950 text-slate-200">
              <MatchControlWrapper />
            </div>
          </PrivateRoute>
        }
      />

      {/* ── Delegado — ahora una sola página con tabs internos ───── */}
      <Route
        path="/dashboard-delegado"
        element={
          <PrivateRoute allowedRoles={["DELEGADO"]}>
            <DashboardDelegadoPage />
          </PrivateRoute>
        }
      />
      {/* Redirecciones de compatibilidad hacia las rutas antiguas */}
      <Route path="/delegado" element={<Navigate to="/dashboard-delegado" replace />} />
      <Route path="/delegado/*" element={<Navigate to="/dashboard-delegado" replace />} />

      {/* ── Fallback ─────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
