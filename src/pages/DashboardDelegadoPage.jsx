import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Table2,
  Award,
  Calendar,
  Settings,
  PlusCircle,
  ArrowLeft,
  Trophy,
  X,
} from "lucide-react";

import api from "../api/api";

// Layout unificado
import DashboardShell from "../components/templates/DashboardLayout/DashboardShell";

// Componentes de contenido
import TeamGrid from "../components/organisms/TeamGrid/TeamGrid";
import RegisterTeamForm from "../components/organisms/RegisterTeamForm/RegisterTeamForm";
import PlayerRoster from "../components/organisms/PlayerRoster/PlayerRoster";
import PosicionesPage from "./PosicionesPage";
import EstadisticasOrganizadorPage from "./EstadisticasOrganizadorPage";
import GlobalCalendar from "../components/organisms/Calendar/GlobalCalendar";

// ── Menú del Delegado ────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { id: "dashboard",    label: "Dashboard",              icon: LayoutDashboard },
  { id: "equipos",      label: "Mis Equipos",            icon: Users },
  { id: "posiciones",   label: "Tablas de Posiciones",   icon: Table2 },
  { id: "estadisticas", label: "Estadísticas del Torneo",icon: Award },
  { id: "calendario",   label: "Calendario Global",      icon: Calendar },
  { id: "configuracion",label: "Configuración",          icon: Settings },
];

// ── Componente principal ─────────────────────────────────────────────────────
const DashboardDelegadoPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const nombre = userObj.nombre || "Delegado";

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  const cargarEquipos = useCallback(async () => {
    setCargando(true);
    try {
      const res = await api.get("/equipos/mis-equipos");
      setEquipos(res.data?.datos ?? []);
    } catch (err) {
      console.error("Error al cargar equipos:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setCargando(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  const handleEquipoCreado = () => {
    setMostrarModal(false);
    cargarEquipos();
  };

  // Cuando el usuario cambia de tab, limpiamos la selección de equipo
  const handleTabChange = (tab) => {
    setEquipoSeleccionado(null);
    setActiveTab(tab);
  };

  // ── Vista: jugadores de un equipo ─────────────────────────────────────────
  const renderEquipoDetalle = () => (
    <div className="space-y-4 animate-fade-in">
      <button
        onClick={() => setEquipoSeleccionado(null)}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900 hover:text-white border border-slate-800 px-3 py-2 rounded-xl transition-all"
      >
        <ArrowLeft size={14} />
        Volver a Mis Equipos
      </button>
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-md shadow-2xl">
        <PlayerRoster
          equipo={equipoSeleccionado}
          onBack={() => setEquipoSeleccionado(null)}
        />
      </div>
    </div>
  );

  // ── Vista principal de equipos ────────────────────────────────────────────
  const renderEquipos = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="text-blue-500" size={24} />
            Mis Equipos Administrados
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Gestiona tus clubes, inscripciones y plantillas de jugadores en tiempo real
          </p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <PlusCircle size={16} />
          Inscribir Nuevo Equipo
        </button>
      </div>

      <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-md shadow-2xl">
        <TeamGrid
          equipos={equipos}
          loading={cargando}
          onGestionarJugadores={(equipo) => setEquipoSeleccionado(equipo)}
        />
      </div>
    </div>
  );

  // ── Contenido según tab ───────────────────────────────────────────────────
  const renderContent = () => {
    // Si hay un equipo seleccionado (desde "dashboard" o "equipos"), mostramos el detalle
    if (equipoSeleccionado) return renderEquipoDetalle();

    switch (activeTab) {
      case "dashboard":
      case "equipos":
        return renderEquipos();

      case "posiciones":
        return <PosicionesPage />;

      case "estadisticas":
        return <EstadisticasOrganizadorPage />;

      case "calendario":
        return (
          <div className="animate-fade-in">
            <GlobalCalendar />
          </div>
        );

      default:
        return (
          <div className="text-slate-500 p-12 text-center italic text-sm bg-slate-900/30 rounded-2xl border border-slate-800/40">
            Sección "{activeTab}" en desarrollo...
          </div>
        );
    }
  };

  // ── Header actions ────────────────────────────────────────────────────────
  const headerActions =
    (activeTab === "dashboard" || activeTab === "equipos") && !equipoSeleccionado ? (
      <button
        onClick={() => setMostrarModal(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
      >
        <PlusCircle size={14} />
        Inscribir Equipo
      </button>
    ) : null;

  return (
    <>
      <DashboardShell
        role="DELEGADO"
        roleLabel="Panel Delegado"
        accentColor="blue"
        menuItems={MENU_ITEMS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        headerTitle={`Hola, ${nombre} 👋`}
        headerSubtitle={`Panel Delegado › ${activeTab.toUpperCase()}`}
        headerActions={headerActions}
      >
        {renderContent()}
      </DashboardShell>

      {/* ── Modal Inscribir Equipo ────────────────────────────────── */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMostrarModal(false)}
          />
          <div className="relative bg-slate-950 border border-slate-800/80 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            <div className="p-5 border-b border-slate-900 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Trophy className="text-blue-400" size={18} />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Nueva Inscripción de Equipo
                </h3>
              </div>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-900 rounded-xl transition-colors border border-transparent hover:border-slate-800"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <RegisterTeamForm onSuccess={handleEquipoCreado} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardDelegadoPage;
