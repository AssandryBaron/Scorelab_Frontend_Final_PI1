import React from "react";
import { Target, ShieldAlert } from "lucide-react";
import Spinner from "../../atoms/Spinner/Spinner";
import EmptyState from "../../atoms/EmptyState/EmptyState";

/**
 * StatsTable — Organismo dual para Goleadores y Control Disciplinario.
 *
 * Props:
 * - datos:      PlayerStatsDTO[]  — Lista de estadísticas ya ordenadas
 * - modo:       "goleadores" | "disciplina"  — Controla qué columnas mostrar
 * - cargando:   boolean
 * - titulo:     string?
 */
const StatsTable = ({
  datos = [],
  modo = "goleadores",
  cargando = false,
  titulo,
}) => {
  const esGoleadores = modo === "goleadores";
  const esDisiplina = modo === "disciplina";

  // ── Helpers de medallas ──────────────────────────────────────────────────

  const medallaStyle = (index) => {
    if (index === 0)
      return "bg-yellow-400 text-black shadow-[0_0_14px_rgba(250,204,21,0.4)] font-black";
    if (index === 1) return "bg-slate-300 text-black font-black";
    if (index === 2) return "bg-amber-700 text-white font-black";
    return "text-slate-500 font-medium";
  };

  // ── Render ───────────────────────────────────────────────────────────────

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const emptyMsg = esGoleadores
    ? "Aún no hay goles registrados en partidos finalizados."
    : "No hay jugadores amonestados registrados.";

  return (
    <div className="animate-fade-in">
      {/* Encabezado opcional */}
      {titulo && (
        <div className="flex items-center gap-3 mb-5">
          {esGoleadores ? (
            <Target size={20} className="text-[#00FF9C]" />
          ) : (
            <ShieldAlert size={20} className="text-yellow-400" />
          )}
          <h3 className="text-base font-bold text-white tracking-tight">
            {titulo}
          </h3>
        </div>
      )}

      {datos.length === 0 ? (
        <EmptyState mensaje={emptyMsg} />
      ) : (
        <div className="rounded-2xl overflow-hidden border border-slate-800/70 shadow-2xl shadow-black/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              {/* ── Cabecera ─────────────────────────────────────────────── */}
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center w-14">
                    #
                  </th>
                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Jugador
                  </th>
                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Equipo
                  </th>

                  {/* Columna GOLES — solo en modo goleadores */}
                  {esGoleadores && (
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#00FF9C] text-center bg-[#00FF9C]/5">
                      ⚽ Goles
                    </th>
                  )}

                  {/* Columnas DISCIPLINA — solo en modo disciplina */}
                  {esDisiplina && (
                    <>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-yellow-400 text-center">
                        🟨 Amarillas
                      </th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-red-400 text-center">
                        🟥 Rojas
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              {/* ── Cuerpo ───────────────────────────────────────────────── */}
              <tbody className="divide-y divide-slate-800/40 bg-slate-950/60">
                {datos.map((jugador, index) => {
                  // Mapeo adaptativo seguro para el DTO
                  const nombreJugador =
                    jugador.nombreJugador ||
                    jugador.jugadorNombre ||
                    jugador.nombre ||
                    jugador.jugador ||
                    "Jugador";
                  const nombreEquipo =
                    jugador.nombreEquipo ||
                    jugador.equipoNombre ||
                    jugador.equipo ||
                    "Equipo Libre";
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
                      key={jugador.jugadorId || jugador.id || index}
                      className="hover:bg-slate-900/50 transition-colors duration-150 group"
                    >
                      {/* Posición */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${medallaStyle(index)}`}
                        >
                          {index + 1}
                        </span>
                      </td>

                      {/* Nombre */}
                      <td className="px-4 py-3.5">
                        <span className="text-white font-semibold group-hover:text-[#00FF9C] transition-colors">
                          {nombreJugador}
                        </span>
                      </td>

                      {/* Equipo */}
                      <td className="px-4 py-3.5">
                        <span className="text-slate-400 text-xs bg-slate-800/60 px-2 py-1 rounded-lg">
                          {nombreEquipo}
                        </span>
                      </td>

                      {/* Goles */}
                      {esGoleadores && (
                        <td className="px-6 py-3.5 text-center bg-[#00FF9C]/5">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#00FF9C] shadow-[0_0_6px_rgba(0,255,156,0.5)]" />
                            <span className="text-[#00FF9C] font-black text-lg drop-shadow-[0_0_8px_rgba(0,255,156,0.4)]">
                              {goles}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Tarjeta Amarilla */}
                      {esDisiplina && (
                        <td className="px-4 py-3.5 text-center">
                          {amarillas > 0 ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="w-3 h-4 rounded-sm bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                              <span className="text-yellow-400 font-bold">
                                {amarillas}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-700 text-xs">—</span>
                          )}
                        </td>
                      )}

                      {/* Tarjeta Roja */}
                      {esDisiplina && (
                        <td className="px-4 py-3.5 text-center">
                          {rojas > 0 ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="w-3 h-4 rounded-sm bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                              <span className="text-red-400 font-bold">
                                {rojas}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-700 text-xs">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsTable;
