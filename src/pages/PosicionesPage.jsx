import React, { useState, useEffect } from "react";
import {
  Trophy,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
} from "lucide-react";
import api from "../api/api";

const PosicionesPage = ({ torneos, loadingTorneos }) => {
  const [torneoSeleccionado, setTorneoSeleccionado] = useState("");
  const [posiciones, setPosiciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Setea el torneo por defecto (el primero de la lista o el ID 1 tras la limpieza)
  useEffect(() => {
    if (torneos && torneos.length > 0) {
      setTorneoSeleccionado(torneos[0].id);
    } else {
      setTorneoSeleccionado("1"); // Fallback seguro para tu base de datos limpia
    }
  }, [torneos]);

  useEffect(() => {
    const fetchPosiciones = async () => {
      if (!torneoSeleccionado) return;
      try {
        setCargando(true);
        setErrorMsg("");

        // ✨ CORRECCIÓN DINÁMICA: Ya no está quemado el ID 10.
        // Ahora consulta usando el torneo activo de tu base de datos.
        const res = await api.get(
          `/estadisticas/posiciones?torneoId=${torneoSeleccionado}`,
        );

        // Adaptabilidad total a las estructuras comunes del backend
        const datosExtraidos =
          res.data?.datos || res.data?.data || res.data || [];
        setPosiciones(datosExtraidos);
      } catch (error) {
        console.error("Error al cargar posiciones:", error);
        setErrorMsg("No se pudieron cargar los datos reales del torneo.");
        setPosiciones([]);
      } finally {
        setCargando(false);
      }
    };

    fetchPosiciones();
  }, [torneoSeleccionado]);

  if (loadingTorneos || (cargando && posiciones.length === 0)) {
    return (
      <div className="p-10 text-blue-500 animate-pulse font-bold text-center">
        Calculando posiciones del torneo en tiempo real...
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Encabezado con selector de Torneo dinámico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            Tabla de Posiciones
          </h1>
          <p className="text-slate-500 text-sm">
            Clasificación en tiempo real del torneo actual
          </p>
        </div>

        {/* Muestra el selector solo si el componente recibe la lista de torneos */}
        {torneos && torneos.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400 whitespace-nowrap">
              Torneo:
            </label>
            <select
              value={torneoSeleccionado}
              onChange={(e) => setTorneoSeleccionado(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
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
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="bg-slate-950/50 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-5 font-bold text-center w-16">Pos</th>
                <th className="px-6 py-5 font-bold">Equipo</th>
                <th className="px-4 py-5 font-bold text-center">PJ</th>
                <th className="px-4 py-5 font-bold text-center text-green-500">
                  PG
                </th>
                <th className="px-4 py-5 font-bold text-center text-slate-400">
                  PE
                </th>
                <th className="px-4 py-5 font-bold text-center text-red-500">
                  PP
                </th>
                <th className="px-4 py-5 font-bold text-center">GF</th>
                <th className="px-4 py-5 font-bold text-center">GC</th>
                <th className="px-4 py-5 font-bold text-center">DG</th>
                <th className="px-6 py-5 font-bold text-center bg-blue-600/10 text-blue-400">
                  PTS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {posiciones.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-10 text-center text-slate-500 font-medium"
                  >
                    No hay estadísticas disponibles para este torneo o ningún
                    partido ha FINALIZADO.
                  </td>
                </tr>
              ) : (
                posiciones.map((equipo, index) => (
                  <tr
                    key={equipo.equipoId || index}
                    className="hover:bg-slate-900/40 transition-colors group"
                  >
                    {/* Posición */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                          index === 0
                            ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                            : index < 4
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                              : "text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>

                    {/* Nombre del Equipo */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        <span className="text-white font-bold group-hover:text-blue-400 transition-colors">
                          {equipo.nombreEquipo ||
                            equipo.equipoNombre ||
                            equipo.nombre ||
                            "Equipo Desconocido"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center text-slate-300 font-medium">
                      {equipo.pj != null
                        ? equipo.pj
                        : equipo.partidosJugados || 0}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300 font-medium">
                      {equipo.pg != null
                        ? equipo.pg
                        : equipo.partidosGanados || 0}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300 font-medium">
                      {equipo.pe != null
                        ? equipo.pe
                        : equipo.partidosEmpatados || 0}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300 font-medium">
                      {equipo.pp != null
                        ? equipo.pp
                        : equipo.partidosPerdidos || 0}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-400 text-xs">
                      {equipo.gf != null ? equipo.gf : equipo.golesAFavor || 0}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-400 text-xs">
                      {equipo.gc != null
                        ? equipo.gc
                        : equipo.golesEnContra || 0}
                    </td>

                    {/* Diferencia de Goles */}
                    <td
                      className={`px-4 py-4 text-center font-bold ${
                        (equipo.dif || equipo.diferenciaGoles) > 0
                          ? "text-green-500"
                          : (equipo.dif || equipo.diferenciaGoles) < 0
                            ? "text-red-500"
                            : "text-slate-500"
                      }`}
                    >
                      {castDiferencia(equipo)}
                    </td>

                    {/* Puntos */}
                    <td className="px-6 py-4 text-center bg-blue-600/5">
                      <span className="text-blue-400 font-black text-lg">
                        {equipo.pts != null ? equipo.pts : equipo.puntos || 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex gap-6 text-[10px] uppercase tracking-widest font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> Campeón /
          Líder
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600/40 rounded-sm border border-blue-500/50"></div>{" "}
          Zona Clasificación
        </div>
      </div>
    </div>
  );
};

// Función auxiliar para controlar de forma segura el renderizado de la diferencia de goles
const castDiferencia = (equipo) => {
  const d = equipo.dif != null ? equipo.dif : equipo.diferenciaGoles || 0;
  return d > 0 ? `+${d}` : d;
};

export default PosicionesPage;
