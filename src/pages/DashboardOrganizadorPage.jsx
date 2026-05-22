import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Users2,
  UserSquare2,
  Sword,
  Table2,
  BarChart3,
  CalendarDays,
  Settings,
} from "lucide-react";

import { useTorneos } from "../hooks/useTorneos";
import api from "../api/api";

// Layout unificado
import DashboardShell from "../components/templates/DashboardLayout/DashboardShell";

// Componentes de contenido
import TorneoGrid from "../components/organisms/TorneoGrid/TorneoGrid";
import SolicitudesTable from "../components/organisms/SolicitudesTable/SolicitudesTable";
import CrearTorneoModal from "../components/organisms/CrearTorneoModal/CrearTorneoModal";
import TournamentMatches from "../components/organisms/TournamentMatches/TournamentMatches";
import GlobalCalendar from "../components/organisms/Calendar/GlobalCalendar";
import JugadoresPage from "./JugadoresPage";
import PosicionesPage from "./PosicionesPage";
import EstadisticasOrganizadorPage from "./EstadisticasOrganizadorPage";
import Button from "../components/atoms/Button/Button";

// ── Menú del Organizador ─────────────────────────────────────────────────────
const MENU_ITEMS = [
  { id: "dashboard",     label: "Dashboard",               icon: LayoutDashboard },
  { id: "torneos",       label: "Mis Torneos",             icon: Trophy },
  { id: "equipos",       label: "Validar Equipos",         icon: Users2 },
  { id: "jugadores",     label: "Base de Jugadores",       icon: UserSquare2 },
  { id: "partidos",      label: "Gestión de Partidos",     icon: Sword },
  { id: "posiciones",    label: "Tablas de Posiciones",    icon: Table2 },
  { id: "estadisticas",  label: "Estadísticas Goleadores", icon: BarChart3 },
  { id: "calendario",    label: "Calendario Global",       icon: CalendarDays },
  { id: "configuracion", label: "Configuración",           icon: Settings },
];

// ── Utilidad: sección de contenido ───────────────────────────────────────────
const Section = ({ title, children }) => (
  <section className="space-y-5">
    {title && (
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.18em]">
        {title}
      </h2>
    )}
    {children}
  </section>
);

// ── Componente principal ─────────────────────────────────────────────────────
const DashboardOrganizadorPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modalAbierto, setModalAbierto] = useState(false);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const nombre = user?.nombre || "Organizador";

  const { torneos, loading: cargandoTorneos, refresh: refreshTorneos } = useTorneos();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true);

  const cargarSolicitudes = useCallback(async () => {
    setCargandoSolicitudes(true);
    try {
      const res = await api.get("/equipos/solicitudes");
      setSolicitudes(res.data?.datos || res.data?.data || []);
    } catch (err) {
      console.error("Error cargando solicitudes", err);
    } finally {
      setCargandoSolicitudes(false);
    }
  }, []);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  const handleRefreshAll = () => {
    cargarSolicitudes();
    refreshTorneos();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ── Contenido según tab activa ─────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-10 animate-fade-in">
            <Section title="🏆 Torneos activos">
              <TorneoGrid torneos={torneos} loading={cargandoTorneos} />
            </Section>
            <Section title="📋 Solicitudes pendientes">
              <SolicitudesTable
                solicitudes={solicitudes}
                cargando={cargandoSolicitudes}
                onRefresh={handleRefreshAll}
              />
            </Section>
          </div>
        );

      case "torneos":
        return (
          <div className="animate-fade-in space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.18em]">
                Todos los torneos
              </h2>
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                onClick={() => setModalAbierto(true)}
              >
                + Nuevo Torneo
              </button>
            </div>
            <TorneoGrid torneos={torneos} loading={cargandoTorneos} />
          </div>
        );

      case "equipos":
        return (
          <div className="animate-fade-in space-y-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.18em]">
              Validación de equipos
            </h2>
            <SolicitudesTable
              solicitudes={solicitudes}
              cargando={cargandoSolicitudes}
              onRefresh={handleRefreshAll}
            />
          </div>
        );

      case "jugadores":
        return <JugadoresPage />;

      case "partidos":
        return (
          <div className="animate-fade-in space-y-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.18em]">
              ⚽ Gestión de Partidos
            </h2>
            {torneos.length > 0 ? (
              <TournamentMatches torneoId={torneos[0].id} />
            ) : (
              <p className="text-slate-500 italic text-sm">
                Crea un torneo primero para gestionar partidos.
              </p>
            )}
          </div>
        );

      case "posiciones":
        return <PosicionesPage />;

      case "estadisticas":
        return (
          <EstadisticasOrganizadorPage
            torneos={torneos}
            loadingTorneos={cargandoTorneos}
          />
        );

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

  // ── Header actions condicionales ───────────────────────────────────────────
  const headerActions =
    activeTab === "dashboard" || activeTab === "torneos" ? (
      <Button variant="success" size="sm" onClick={() => setModalAbierto(true)}>
        + Crear Torneo
      </Button>
    ) : null;

  return (
    <>
      <DashboardShell
        role="ORGANIZADOR"
        roleLabel="Panel Organizador"
        accentColor="blue"
        menuItems={MENU_ITEMS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        headerTitle={`Hola, ${nombre} 👋`}
        headerSubtitle={`Panel Organizador › ${activeTab.toUpperCase()}`}
        headerActions={headerActions}
      >
        {renderContent()}
      </DashboardShell>

      {modalAbierto && (
        <CrearTorneoModal
          onClose={() => setModalAbierto(false)}
          onSuccess={() => {
            setModalAbierto(false);
            refreshTorneos();
          }}
        />
      )}
    </>
  );
};

export default DashboardOrganizadorPage;
