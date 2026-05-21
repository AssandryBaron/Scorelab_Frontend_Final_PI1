import React, { useState, useEffect } from "react";
import { Trophy, Award, ShieldAlert } from "lucide-react";
import api from "../api/api";

const EstadisticasOrganizadorPage = ({ torneos, loadingTorneos }) => {
  const [torneoSeleccionado, setTorneoSeleccionado] = useState("");
  const [activeTab, setActiveTab] = useState("goleadores"); // "goleadores" o "tarjetas"
  const [stats, setStats] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Sincronizar el torneo por defecto
  useEffect(() => {
    if (torneos && torneos.length > 0) {
      setTorneoSeleccionado(torneos[0].id);
    } else {
      setTorneoSeleccionado("1"); // Fallback seguro para base de datos limpia
    }
  }, [torneos]);

  // Fetch de estadísticas unificadas
  useEffect(() => {
    const fetchEstadisticas = async () => {
      if (!torneoSeleccionado) return;
      try {
        setCargando(true);
        setErrorMsg("");

        // Apuntamos al endpoint que retorna la lista de PlayerStatsDTO
        const res = await api.get(
          `/estadisticas/goleadores?torneoId=${torneoSeleccionado}`,
        );

        const datos = res.data?.datos || res.data?.data || res.data || [];
        setStats(datos);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setErrorMsg("No se pudieron obtener las estadísticas en tiempo real.");
        setStats([]);
      } finally {
        setCargando(false);
      }
    };

    fetchEstadisticas();
  }, [torneoSeleccionado]);

  // Ordenar datos dinámicamente según la pestaña activa
  const datosOrdenados = [...stats].sort((a, b) => {
    // Normalización defensiva de datos para el ordenamiento
    const golesA = a.goles !== undefined ? a.goles : 0;
    const golesB = b.goles !== undefined ? b.goles : 0;

    const amarillasA =
      a.amarillas !== undefined ? a.amarillas : a.tarjetasAmarillas || 0;
    const amarillasB =
      b.amarillas !== undefined ? b.amarillas : b.tarjetasAmarillas || 0;

    const rojasA = a.rojas !== undefined ? a.rojas : a.tarjetasRojas || 0;
    const rojasB = b.rojas !== undefined ? b.rojas : b.tarjetasRojas || 0;

    if (activeTab === "goleadores") {
      return golesB - golesA; // Más goles primero
    } else {
      // Prioridad a rojas, luego amarillas para el FairPlay
      if (rojasB !== rojasA) return rojasB - rojasA;
      return amarillasB - amarillasA;
    }
  });

  if (loadingTorneos || (cargando && stats.length === 0)) {
    return (
      <div className="p-10 text-blue-500 animate-pulse font-bold text-center">
        Procesando estadísticas y tarjetas en tiempo real...
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            Estadísticas del Torneo
          </h1>
          <p className="text-slate-500 text-sm">
            Rendimiento individual y control de tarjetas de los jugadores
          </p>
        </div>

        {/* Selector de Torneo */}
        {torneos && torneos.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400 whitespace-nowrap">
              Torneo:
            </label>
            <select
              value={torneoSeleccionado}
              onChange={(e) => setTorneoSeleccionado(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-2.5"
            >
              {torneos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* 🔄 Selector de Sub-pestañas (Tabs) */}
      <div className="flex gap-4 mb-6 border-b border-slate-800/60 pb-px">
        <button
          onClick={() => setActiveTab("goleadores")}
          className={`flex items-center gap-2 pb-4 text-sm font-bold tracking-tight transition-all relative ${
            activeTab === "goleadores"
              ? "text-blue-400"
              : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Award size={18} />
          Tabla de Goleadores
          {activeTab === "goleadores" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("tarjetas")}
          className={`flex items-center gap-2 pb-4 text-sm font-bold tracking-tight transition-all relative ${
            activeTab === "tarjetas"
              ? "text-red-400"
              : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <ShieldAlert size={18} />
          Control de Tarjetas (Fair Play)
          {activeTab === "tarjetas" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          )}
        </button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-slate-950/50 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-5 font-bold text-center w-16">POS</th>
                <th className="px-6 py-5 font-bold">Jugador</th>
                <th className="px-6 py-5 font-bold">Equipo</th>
                {activeTab === "goleadores" ? (
                  <th className="px-6 py-5 font-bold text-center bg-blue-600/10 text-blue-400 w-32">
                    Goles
                  </th>
                ) : (
                  <>
                    <th className="px-6 py-5 font-bold text-center w-32">
                      Amarillas
                    </th>
                    <th className="px-6 py-5 font-bold text-center w-32">
                      Rojas
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {datosOrdenados.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-500 font-medium"
                  >
                    No hay registros de eventos cargados en este torneo todavía.
                  </td>
                </tr>
              ) : (
                datosOrdenados.map((jugador, index) => {
                  // Mapeos adaptativos hiper-seguros para las propiedades del objeto
                  const nombreJugador =
                    jugador.nombre || jugador.jugadorNombre || "Jugador";
                  const nombreEquipo =
                    jugador.equipo || jugador.equipoNombre || "Sin Equipo";
                  const goles = jugador.goles !== undefined ? jugador.goles : 0;

                  const amarillas =
                    jugador.amarillas !== undefined
                      ? jugador.amarillas
                      : jugador.tarjetasAmarillas || 0;

                  const rojas =
                    jugador.rojas !== undefined
                      ? jugador.rojas
                      : jugador.tarjetasRojas || 0;

                  return (
                    <tr
                      key={jugador.jugadorId || index}
                      className="hover:bg-slate-900/40 transition-colors group"
                    >
                      {/* Posición */}
                      <td className="px-6 py-4 text-center text-slate-400 font-bold">
                        {index + 1}
                      </td>

                      {/* Jugador */}
                      <td className="px-6 py-4 text-white font-bold group-hover:text-blue-400 transition-colors">
                        {nombreJugador}
                      </td>

                      {/* Equipo */}
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {nombreEquipo}
                      </td>

                      {/* Renderizado condicional según la pestaña elegida */}
                      {activeTab === "goleadores" ? (
                        <td className="px-6 py-4 text-center bg-blue-600/5">
                          <span className="text-blue-400 font-black text-lg">
                            {goles}
                          </span>
                        </td>
                      ) : (
                        <>
                          {/* Tarjetas Amarillas */}
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                                amarillas > 0
                                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                  : "bg-slate-900 text-slate-600 border-slate-800"
                              }`}
                            >
                              <div
                                className={`w-2 h-3 rounded-xs ${amarillas > 0 ? "bg-yellow-500" : "bg-slate-700"}`}
                              />
                              {amarillas}
                            </span>
                          </td>
                          {/* Tarjetas Rojas */}
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                                rojas > 0
                                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                                  : "bg-slate-900 text-slate-600 border-slate-800"
                              }`}
                            >
                              <div
                                className={`w-2 h-3 rounded-xs ${rojas > 0 ? "bg-red-500" : "bg-slate-700"}`}
                              />
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
};

export default EstadisticasOrganizadorPage;
