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
import MatchManager from "./components/organisms/MatchControl/MatchManager";
import SpectatorDashboard from "./pages/SpectatorDashboard";

// 🚀 Importaciones de Módulos Reutilizables Generales Corregidos
import PosicionesPage from "./pages/PosicionesPage";
import EstadisticasOrganizadorPage from "./pages/EstadisticasOrganizadorPage";
import CalendarPage from "./pages/CalendarPage"; // 👈 Tu página real de calendario conectado

// Template Atómico del Delegado (Contiene el Sidebar y el Header global)
import DelegadoLayout from "./components/templates/DelegadoLayout/DelegadoLayout";

const MatchControlWrapper = () => {
  const { partidoId } = useParams();
  return <MatchManager partidoId={partidoId} />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* ========================================================= */}
      {/* Rutas Públicas Absolutas                                  */}
      {/* ========================================================= */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/espectador" element={<SpectatorDashboard />} />

      {/* ========================================================= */}
      {/* Rutas Protegidas: Dashboard Organizador                  */}
      {/* ========================================================= */}
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

      {/* ========================================================= */}
      {/* Rutas Protegidas: Dashboard Delegado Unificado           */}
      {/* ========================================================= */}

      {/* Redirección por si el Login apunta a la ruta antigua */}
      <Route
        path="/dashboard-delegado"
        element={<Navigate to="/delegado/dashboard" replace />}
      />

      {/* 🛡️ RUTA MAESTRA DEL DELEGADO (Carga el layout una Sola vez) */}
      <Route
        path="/delegado"
        element={
          <PrivateRoute allowedRoles={["DELEGADO"]}>
            <DelegadoLayout />
          </PrivateRoute>
        }
      >
        {/* 🎯 CONTENIDOS INTERNOS: Se inyectan de forma limpia en el <Outlet /> */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardDelegadoPage />} />
        <Route path="equipos" element={<DashboardDelegadoPage />} />

        {/* Conexión directa con los módulos generales existentes */}
        <Route path="posiciones" element={<PosicionesPage />} />
        <Route path="estadisticas" element={<EstadisticasOrganizadorPage />} />

        {/* 🚀 AQUÍ CONECTAMOS TU PÁGINA REAL DE CALENDARIO / FIXTURE */}
        <Route path="calendario" element={<CalendarPage />} />

        {/* Rutas adicionales pendientes por integrar */}
        <Route
          path="configuracion"
          element={
            <div className="p-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl backdrop-blur-md">
              <h2 className="text-xl font-black text-white mb-2">
                Configuración
              </h2>
              <p className="text-sm text-slate-400">
                Ajustes del perfil del delegado.
              </p>
            </div>
          }
        />
      </Route>

      {/* Fallback de seguridad */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
