import React, { useState, useEffect, useCallback } from "react";
import {
  Trophy,
  ChevronDown,
  RefreshCw,
  Clock,
  CheckCircle2,
  Circle,
  Award,
  ShieldAlert,
  CalendarDays,
  Table2,
  Target,
  LogIn,
} from "lucide-react";
import {
  getTorneos,
  getPartidosTorneo,
  getPosicionesTorneo,
  getGoleadoresTorneo,
} from "../services/public.service";
import { useNavigate } from "react-router-dom";

// Layout unificado
import DashboardShell from "../components/templates/DashboardLayout/DashboardShell";

// Componentes compartidos
import StandingTable from "../components/organisms/StandingTable/StandingTable";
import Spinner from "../components/atoms/Spinner/Spinner";

// ── Menú del Espectador ──────────────────────────────────────────────────────
const MENU_ITEMS = [
  { id: "calendario",  label: "Calendario Global",        icon: CalendarDays },
  { id: "posiciones",  label: "Tablas de Posiciones",     icon: Table2 },
  { id: "goleadores",  label: "Estadísticas Goleadores",  icon: Target },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatFecha = (fechaHora) => {
  if (!fechaHora) return "—";
  const d = new Date(fechaHora);
  return (
    d.toLocaleDateString("es-CO", { weekday: "short", day: "2-digit", month: "short" }) +
    " · " +
    d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
  );
};

const estadoTorneoBadge = (estado) => {
  const map = {
    EN_CURSO:  "text-[#00FF9C] bg-[#00FF9C]/10 border border-[#00FF9C]/20",
    PROXIMO:   "text-blue-400 bg-blue-400/10 border border-blue-400/20",
    FINALIZADO:"text-slate-400 bg-slate-900",
  };
  return map[estado] ?? map["PROXIMO"];
};

// ── Sub-componentes ──────────────────────────────────────────────────────────
const EstadoBadge = ({ estado }) => {
  const cfg = {
    FINALIZADO: { label: "Finalizado",  cls: "bg-slate-800 text-slate-400" },
    EN_CURSO:   { label: "En vivo 🔴", cls: "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse" },
    PROGRAMADO: { label: "Programado",  cls: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
    CANCELADO:  { label: "Cancelado",   cls: "bg-red-900/40 text-red-500" },
  };
  const { label, cls } = cfg[estado] ?? cfg["PROGRAMADO"];
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${cls}`}>
      {label}
    </span>
  );
};

const EstadoIcono = ({ estado }) => {
  if (estado === "FINALIZADO") return <CheckCircle2 size={14} className="text-[#00FF9C]" />;
  if (estado === "EN_CURSO")   return <Circle size={14} className="text-red-400 animate-pulse" />;
  return <Clock size={14} className="text-slate-500" />;
};

const PartidoCard = ({ partido }) => {
  const finalizado = partido.estado === "FINALIZADO";
  const local     = partido.equipoLocal?.nombre     ?? "Local";
  const visitante = partido.equipoVisitante?.nombre ?? "Visitante";

  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 hover:border-slate-800/80 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <EstadoIcono estado={partido.estado} />
          <span className="text-[11px] text-slate-500 font-medium">{formatFecha(partido.fechaHora)}</span>
        </div>
        <EstadoBadge estado={partido.estado} />
      </div>

      <div className="flex items-center justify-between gap-4 my-2">
        <div className="flex-1 text-center">
          <p className="font-bold text-sm text-white truncate">{local}</p>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">LOCAL</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {finalizado ? (
            <div className="flex items-center gap-2 bg-slate-950/80 rounded-xl px-3 py-1.5 border border-slate-900">
              <span className="text-white font-black text-base">{partido.golesLocal ?? 0}</span>
              <span className="text-slate-700 text-xs font-bold">—</span>
              <span className="text-white font-black text-base">{partido.golesVisitante ?? 0}</span>
            </div>
          ) : (
            <span className="text-slate-600 font-black text-lg tracking-widest">vs</span>
          )}
        </div>

        <div className="flex-1 text-center">
          <p className="font-bold text-sm text-white truncate">{visitante}</p>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">VISITANTE</p>
        </div>
      </div>
    </div>
  );
};

// ── Componente principal ─────────────────────────────────────────────────────
const SpectatorDashboard = () => {
  const navigate = useNavigate();
  const [torneos, setTorneos]           = useState([]);
  const [torneoSelec, setTorneoSelec]   = useState(null);
  const [activeTab, setActiveTab]       = useState("calendario");
  const [subTab, setSubTab]             = useState("goleadores");
  const [cargandoTorneos, setCargandoTorneos] = useState(true);
  const [partidos, setPartidos]         = useState([]);
  const [posiciones, setPosiciones]     = useState([]);
  const [stats, setStats]               = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [error, setError]               = useState(null);

  // Carga inicial de torneos
  useEffect(() => {
    setCargandoTorneos(true);
    getTorneos()
      .then((data) => {
        setTorneos(data);
        if (data.length > 0) setTorneoSelec(data[0]);
      })
      .catch(() => setError("No se pudo conectar con el servidor."))
      .finally(() => setCargandoTorneos(false));
  }, []);

  const cargarDatosTab = useCallback(async (torneoId, tab) => {
    if (!torneoId) return;
    setCargandoDatos(true);
    setError(null);
    try {
      if (tab === "calendario")  setPartidos(await getPartidosTorneo(torneoId));
      if (tab === "posiciones")  setPosiciones(await getPosicionesTorneo(torneoId));
      if (tab === "goleadores")  setStats(await getGoleadoresTorneo(torneoId) || []);
    } catch (err) {
      setError("Error cargando datos de la sección.");
      console.error(err);
    } finally {
      setCargandoDatos(false);
    }
  }, []);

  useEffect(() => {
    if (torneoSelec) cargarDatosTab(torneoSelec.id, activeTab);
  }, [torneoSelec, activeTab, cargarDatosTab]);

  const handleTorneoChange = (e) => {
    const t = torneos.find((t) => String(t.id) === e.target.value);
    setTorneoSelec(t ?? null);
  };

  // Ordenamiento de stats
  const datosOrdenados = [...stats].sort((a, b) => {
    const golesA     = a.goles     ?? 0;
    const golesB     = b.goles     ?? 0;
    const amarillasA = a.amarillas ?? a.tarjetasAmarillas ?? 0;
    const amarillasB = b.amarillas ?? b.tarjetasAmarillas ?? 0;
    const rojasA     = a.rojas     ?? a.tarjetasRojas     ?? 0;
    const rojasB     = b.rojas     ?? b.tarjetasRojas     ?? 0;
    if (subTab === "goleadores") return golesB - golesA;
    return rojasB !== rojasA ? rojasB - rojasA : amarillasB - amarillasA;
  });

  // ── Contenido según tab ───────────────────────────────────────────────────
  const renderContent = () => {
    if (!torneoSelec && !cargandoTorneos) {
      return (
        <div className="text-center py-32 bg-slate-950/20 border border-slate-900 rounded-3xl">
          <Trophy size={44} className="mx-auto text-slate-800 mb-3" />
          <p className="text-slate-500 text-sm font-medium">
            No se registran campeonatos públicos en el sistema.
          </p>
        </div>
      );
    }

    if (cargandoDatos) {
      return <div className="flex justify-center py-24"><Spinner /></div>;
    }

    if (error) {
      return (
        <div className="text-center py-16 text-red-400 bg-red-500/5 border border-red-500/20 rounded-2xl">
          ⚠️ {error}
        </div>
      );
    }

    switch (activeTab) {
      case "calendario":
        return partidos.length === 0 ? (
          <p className="text-slate-500 italic text-center py-16 bg-slate-900/20 border border-dashed border-slate-900 rounded-2xl">
            No hay encuentros agendados en este campeonato.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in">
            {partidos.map((p) => <PartidoCard key={p.id} partido={p} />)}
          </div>
        );

      case "posiciones":
        return (
          <StandingTable
            posiciones={posiciones}
            cargando={false}
            titulo="Tabla de Posiciones Oficial"
          />
        );

      case "goleadores":
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-500" /> Estadísticas del Torneo
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Rendimiento individual y control de tarjetas en tiempo real
                </p>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-6 border-b border-slate-900 pb-px">
              {[
                { id: "goleadores", label: "Tabla de Goleadores",         icon: Award,       color: "blue" },
                { id: "tarjetas",   label: "Control de Tarjetas (Fair Play)", icon: ShieldAlert, color: "red" },
              ].map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setSubTab(id)}
                  className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
                    subTab === id
                      ? color === "blue" ? "text-blue-400" : "text-red-400"
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {subTab === id && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${color === "blue" ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"}`} />
                  )}
                </button>
              ))}
            </div>

            {/* Tabla */}
            <div className="bg-slate-950/50 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-500 text-[11px] uppercase tracking-widest border-b border-slate-900">
                      <th className="px-6 py-5 font-bold text-center w-16">POS</th>
                      <th className="px-6 py-5 font-bold">Jugador</th>
                      <th className="px-6 py-5 font-bold">Equipo</th>
                      {subTab === "goleadores" ? (
                        <th className="px-6 py-5 font-bold text-center bg-blue-600/10 text-blue-400 w-32">Goles</th>
                      ) : (
                        <>
                          <th className="px-6 py-5 font-bold text-center w-32">Amarillas</th>
                          <th className="px-6 py-5 font-bold text-center w-32">Rojas</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40">
                    {datosOrdenados.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-slate-500 font-medium italic">
                          No hay registros de eventos en este torneo todavía.
                        </td>
                      </tr>
                    ) : (
                      datosOrdenados.map((jugador, i) => {
                        const nombreJugador = jugador.nombre || jugador.jugadorNombre || "Jugador";
                        const nombreEquipo  = jugador.equipo || jugador.equipoNombre  || "Sin Equipo";
                        const goles         = jugador.goles     ?? 0;
                        const amarillas     = jugador.amarillas ?? jugador.tarjetasAmarillas ?? 0;
                        const rojas         = jugador.rojas     ?? jugador.tarjetasRojas     ?? 0;

                        return (
                          <tr key={jugador.jugadorId || i} className="hover:bg-slate-900/40 transition-colors group">
                            <td className="px-6 py-4 text-center text-slate-500 font-bold text-xs">{i + 1}</td>
                            <td className="px-6 py-4 text-white font-bold group-hover:text-blue-400 transition-colors text-sm">{nombreJugador}</td>
                            <td className="px-6 py-4 text-slate-400 text-sm">{nombreEquipo}</td>
                            {subTab === "goleadores" ? (
                              <td className="px-6 py-4 text-center bg-blue-600/5">
                                <span className="text-blue-400 font-black text-base">{goles}</span>
                              </td>
                            ) : (
                              <>
                                <td className="px-6 py-4 text-center">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${amarillas > 0 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-slate-900 text-slate-600 border-slate-800"}`}>
                                    <div className={`w-2 h-3 rounded-sm ${amarillas > 0 ? "bg-yellow-500" : "bg-slate-700"}`} />
                                    {amarillas}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${rojas > 0 ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-slate-900 text-slate-600 border-slate-800"}`}>
                                    <div className={`w-2 h-3 rounded-sm ${rojas > 0 ? "bg-red-500" : "bg-slate-700"}`} />
                                    {rojas}
                                  </span>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Header actions: selector de torneo + refresh ──────────────────────────
  const headerActions = (
    <div className="flex items-center gap-3">
      <div>
        {torneoSelec?.estado && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mr-3 ${estadoTorneoBadge(torneoSelec.estado)}`}>
            {torneoSelec.estado?.replace("_", " ")}
          </span>
        )}
      </div>
      {cargandoTorneos ? (
        <Spinner size="sm" />
      ) : (
        <div className="relative">
          <Trophy size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
          <select
            className="bg-slate-900 border border-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl pl-9 pr-8 py-2.5 appearance-none cursor-pointer focus:outline-none focus:border-slate-700 transition-all min-w-[200px]"
            value={torneoSelec?.id ?? ""}
            onChange={handleTorneoChange}
          >
            {torneos.length === 0 && <option disabled>Sin campeonatos activos</option>}
            {torneos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      )}
      {torneoSelec && (
        <button
          onClick={() => cargarDatosTab(torneoSelec.id, activeTab)}
          title="Sincronizar Datos"
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
        >
          <RefreshCw size={14} />
        </button>
      )}
    </div>
  );

  return (
    <DashboardShell
      role="ESPECTADOR"
      roleLabel="Portal Público"
      accentColor="blue"
      menuItems={MENU_ITEMS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={() => navigate("/")}
      logoutLabel="Volver al Login"
      headerTitle={torneoSelec ? torneoSelec.nombre : "Portal del Espectador"}
      headerSubtitle={
        torneoSelec?.fechaInicio
          ? `Vigencia: ${torneoSelec.fechaInicio} — ${torneoSelec.fechaFin}`
          : "Monitoreo global de estadísticas del campeonato."
      }
      headerActions={headerActions}
    >
      {renderContent()}
    </DashboardShell>
  );
};

export default SpectatorDashboard;
