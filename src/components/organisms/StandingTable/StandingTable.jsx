import React from "react";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Spinner from "../../atoms/Spinner/Spinner";
import EmptyState from "../../atoms/EmptyState/EmptyState";

/**
 * StandingTable — Organismo que renderiza la Tabla de Posiciones.
 *
 * Props:
 * - posiciones: StandingDTO[]  — Datos ya ordenados que vienen del servicio
 * - cargando:   boolean        — Muestra spinner mientras carga
 * - titulo:     string?        — Título opcional encima de la tabla
 */
const StandingTable = ({ posiciones = [], cargando = false, titulo }) => {
  // ── Helpers de estilo ────────────────────────────────────────────────────

  /** Estilo de la celda de posición según el ranking */
  const badgePosicion = (index) => {
    if (index === 0)
      return "bg-yellow-400 text-black shadow-[0_0_14px_rgba(250,204,21,0.45)] font-black";
    if (index === 1) return "bg-slate-300 text-black font-black";
    if (index === 2) return "bg-amber-700 text-white font-black";
    if (index < 4)
      return "bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 font-bold";
    return "text-slate-500 font-medium";
  };

  /** Color de la diferencia de goles */
  const colorDif = (dif) => {
    if (dif > 0) return "text-[#00FF9C] font-bold";
    if (dif < 0) return "text-red-400 font-bold";
    return "text-slate-500";
  };

  /** Ícono de diferencia de goles */
  const iconDif = (dif) => {
    if (dif > 0)
      return <TrendingUp size={13} className="inline mb-0.5 ml-0.5" />;
    if (dif < 0)
      return <TrendingDown size={13} className="inline mb-0.5 ml-0.5" />;
    return <Minus size={13} className="inline mb-0.5 ml-0.5" />;
  };

  // ── Render ───────────────────────────────────────────────────────────────

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Encabezado opcional */}
      {titulo && (
        <div className="flex items-center gap-3 mb-5">
          <Trophy size={20} className="text-yellow-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            {titulo}
          </h3>
        </div>
      )}

      {posiciones.length === 0 ? (
        <EmptyState mensaje="Aún no hay partidos finalizados para calcular posiciones." />
      ) : (
        <div className="rounded-2xl overflow-hidden border border-slate-800/70 shadow-2xl shadow-black/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              {/* ── Cabecera ─────────────────────────────────────────────── */}
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  {[
                    { label: "#", align: "text-center", w: "w-14" },
                    { label: "Equipo", align: "text-left" },
                    {
                      label: "PJ",
                      align: "text-center",
                      title: "Partidos Jugados",
                    },
                    {
                      label: "PG",
                      align: "text-center text-[#00FF9C]",
                      title: "Partidos Ganados",
                    },
                    {
                      label: "PE",
                      align: "text-center text-slate-400",
                      title: "Partidos Empatados",
                    },
                    {
                      label: "PP",
                      align: "text-center text-red-400",
                      title: "Partidos Perdidos",
                    },
                    {
                      label: "GF",
                      align: "text-center",
                      title: "Goles a Favor",
                    },
                    {
                      label: "GC",
                      align: "text-center",
                      title: "Goles en Contra",
                    },
                    {
                      label: "DG",
                      align: "text-center",
                      title: "Diferencia de Goles",
                    },
                    {
                      label: "PTS",
                      align: "text-center",
                      extra: "text-[#00FF9C] font-black bg-[#00FF9C]/5",
                    },
                  ].map(({ label, align, w, title, extra }) => (
                    <th
                      key={label}
                      title={title}
                      className={`px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500
                        ${align} ${w || ""} ${extra || ""}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ── Cuerpo ───────────────────────────────────────────────── */}
              <tbody className="divide-y divide-slate-800/40 bg-slate-950/60">
                {posiciones.map((eq, index) => {
                  // Mapeo seguro de variables adaptado a tu DTO de Java
                  const nombreEquipo =
                    eq.nombreEquipo ||
                    eq.equipoNombre ||
                    eq.nombre ||
                    eq.equipo ||
                    "Equipo";
                  const pj =
                    eq.partidosJugados !== undefined
                      ? eq.partidosJugados
                      : eq.pj || 0;
                  const pg =
                    eq.partidosGanados !== undefined
                      ? eq.partidosGanados
                      : eq.pg || 0;
                  const pe =
                    eq.partidosEmpatados !== undefined
                      ? eq.partidosEmpatados
                      : eq.pe || 0;
                  const pp =
                    eq.partidosPerdidos !== undefined
                      ? eq.partidosPerdidos
                      : eq.pp || 0;
                  const gf =
                    eq.golesFavor !== undefined ? eq.golesFavor : eq.gf || 0;
                  const gc =
                    eq.golesContra !== undefined ? eq.golesContra : eq.gc || 0;
                  const puntos =
                    eq.puntos !== undefined ? eq.puntos : eq.pts || 0;

                  // Calcular diferencia de goles dinámicamente si no viene mapeada
                  const dif =
                    eq.dif !== undefined
                      ? eq.dif
                      : eq.diferenciaGoles !== undefined
                        ? eq.diferenciaGoles
                        : gf - gc;

                  return (
                    <tr
                      key={eq.equipoId || eq.id || index}
                      className="hover:bg-slate-900/50 transition-colors duration-150 group"
                    >
                      {/* Posición */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${badgePosicion(index)}`}
                        >
                          {index + 1}
                        </span>
                      </td>

                      {/* Nombre del equipo */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              index === 0
                                ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                                : index < 4
                                  ? "bg-[#00FF9C] shadow-[0_0_6px_rgba(0,255,156,0.4)]"
                                  : "bg-slate-600"
                            }`}
                          />
                          <span className="text-white font-semibold group-hover:text-[#00FF9C] transition-colors text-sm">
                            {nombreEquipo}
                          </span>
                        </div>
                      </td>

                      {/* Estadísticas numéricas */}
                      <td className="px-4 py-3.5 text-center text-slate-400 text-xs font-medium">
                        {pj}
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-200 font-semibold">
                        {pg}
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-400">
                        {pe}
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-400">
                        {pp}
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-400 text-xs">
                        {gf}
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-400 text-xs">
                        {gc}
                      </td>

                      {/* Diferencia de goles */}
                      <td
                        className={`px-4 py-3.5 text-center text-xs ${colorDif(dif)}`}
                      >
                        {dif > 0 ? `+${dif}` : dif}
                        {iconDif(dif)}
                      </td>

                      {/* Puntos — columna destacada */}
                      <td className="px-4 py-3.5 text-center bg-[#00FF9C]/5">
                        <span className="text-[#00FF9C] font-black text-base drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]">
                          {puntos}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Leyenda */}
          <div className="px-5 py-3 border-t border-slate-800/60 bg-slate-900/40 flex flex-wrap gap-5">
            {[
              { color: "bg-yellow-400", label: "1er Lugar" },
              {
                color: "bg-[#00FF9C]/20 border border-[#00FF9C]/30",
                label: "Zona Clasificación",
              },
            ].map(({ color, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold"
              >
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandingTable;
