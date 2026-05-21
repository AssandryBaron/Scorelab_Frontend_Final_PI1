import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTorneos } from "../hooks/useTorneos";
import api from "../api/api";

// Componentes
import SidebarOrganizador from "../components/organisms/SidebarOrganizador/SidebarOrganizador";
import AppHeader from "../components/organisms/AppHeader/AppHeader";
import TorneoGrid from "../components/organisms/TorneoGrid/TorneoGrid";
import SolicitudesTable from "../components/organisms/SolicitudesTable/SolicitudesTable";
import CrearTorneoModal from "../components/organisms/CrearTorneoModal/CrearTorneoModal";
import TournamentMatches from "../components/organisms/TournamentMatches/TournamentMatches";
import GlobalCalendar from "../components/organisms/Calendar/GlobalCalendar";
import JugadoresPage from "./JugadoresPage";
import PosicionesPage from "./PosicionesPage"; // ✅ IMPORTACIÓN DE POSICIONES EXISTENTE
import EstadisticasOrganizadorPage from "./EstadisticasOrganizadorPage"; // 📊 NUEVA IMPORTACIÓN SOLICITADA
import Button from "../components/atoms/Button/Button";

const DashboardOrganizadorPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Datos del usuario
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const nombre = user?.nombre || "Organizador";

  // Hook de Torneos
  const {
    torneos,
    loading: cargandoTorneos,
    refresh: refreshTorneos,
  } = useTorneos();

  // Estado para solicitudes y modales
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarSolicitudes = useCallback(async () => {
    setCargandoSolicitudes(true);
    try {
      const res = await api.get("/equipos/solicitudes");
      const listaExtraida = res.data?.datos || res.data?.data || [];
      setSolicitudes(listaExtraida);
    } catch (error) {
      console.error("Error cargando solicitudes", error);
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

  // 🌟 RENDERIZADO DINÁMICO ACTUALIZADO CON EL SISTEMA DE ESTADÍSTICAS
  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="animate-fade-in space-y-12">
            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                🏆 Torneos activos
              </h2>
              <TorneoGrid torneos={torneos} loading={cargandoTorneos} />
            </section>
            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                📋 Solicitudes pendientes
              </h2>
              <SolicitudesTable
                solicitudes={solicitudes}
                cargando={cargandoSolicitudes}
                onRefresh={handleRefreshAll}
              />
            </section>
          </div>
        );

      case "partidos":
        return (
          <div className="animate-fade-in">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
              ⚽ Gestión de Partidos
            </h2>
            {torneos.length > 0 ? (
              <TournamentMatches torneoId={torneos[0].id} />
            ) : (
              <p className="text-slate-500 italic">
                Crea un torneo primero para gestionar partidos.
              </p>
            )}
          </div>
        );

      case "calendario":
        return (
          <div className="animate-fade-in">
            <GlobalCalendar />
          </div>
        );

      case "torneos":
        return (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Todos los Torneos
              </h2>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
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
          <div className="animate-fade-in">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
              Validación de Equipos
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

      case "posiciones":
        return <PosicionesPage />;

      // 📊 NUEVO CASO CONECTADO: Módulo de Estadísticas y Control Global solicitado
      case "estadisticas":
        return (
          <EstadisticasOrganizadorPage
            torneos={torneos}
            loadingTorneos={cargandoTorneos}
          />
        );

      default:
        return (
          <div className="text-slate-500 p-10 text-center italic">
            Sección "{activeTab}" en desarrollo...
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <SidebarOrganizador
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <AppHeader
          title={`Hola, ${nombre} 👋`}
          subtitle={`Panel Organizador > ${activeTab.toUpperCase()}`}
          onLogout={handleLogout}
          actions={
            activeTab === "dashboard" && (
              <Button variant="success" onClick={() => setModalAbierto(true)}>
                + Crear Torneo
              </Button>
            )
          }
        />

        <div className="p-8">
          <div className="max-w-7xl mx-auto">{renderMainContent()}</div>
        </div>
      </main>

      {modalAbierto && (
        <CrearTorneoModal
          onClose={() => setModalAbierto(false)}
          onSuccess={() => {
            setModalAbierto(false);
            refreshTorneos();
          }}
        />
      )}
    </div>
  );
};

export default DashboardOrganizadorPage;
