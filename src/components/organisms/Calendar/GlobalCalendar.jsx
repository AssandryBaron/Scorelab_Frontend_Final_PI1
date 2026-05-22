import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import Spinner from "../../atoms/Spinner/Spinner";
import Badge from "../../atoms/Badge/Badge";

const GlobalCalendar = () => {
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorAcceso, setErrorAcceso] = useState(false);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        setCargando(true);
        setErrorAcceso(false);

        // 🎯 CONEXIÓN REAL EN TIEMPO REAL: Consumimos la API unificada
        // Funciona tanto para el Organizador como para Alma Rosa (Delegada)
        const res = await api.get("/partidos");
        const data = res.data?.datos || res.data?.data || res.data || [];

        setPartidos(data);
      } catch (error) {
        console.error("Error cargando calendario global en vivo:", error);
        if (error.response?.status === 403) {
          setErrorAcceso(true);
        }
      } finally {
        setCargando(false);
      }
    };

    fetchPartidos();
  }, []);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "Por definir";
    try {
      const fechaLimpia = fechaStr.includes(" ")
        ? fechaStr.replace(" ", "T")
        : fechaStr;
      return new Date(fechaLimpia).toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return fechaStr;
    }
  };

  if (errorAcceso) {
    return (
      <div className="p-6 text-center py-20">
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 inline-block">
          <p className="text-red-400 font-medium">
            Error 403: Permisos insuficientes en esta sección.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Comunícate con el administrador para validar tu rol.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Calendario Global</h2>
        <p className="text-slate-400">
          Cronograma de todos los encuentros registrados ({partidos.length}{" "}
          partidos).
        </p>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : partidos.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-20 text-center">
          <p className="text-slate-500 italic">
            No hay partidos registrados en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {partidos.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 bg-blue-600/20 text-blue-400 text-[10px] px-3 py-1 rounded-bl-lg font-bold uppercase tracking-wider">
                UEFA SCORELAB
              </div>

              <div className="flex justify-between items-center mt-4 mb-6 px-2">
                <div className="flex-1 text-center">
                  <p className="font-bold text-white text-sm truncate">
                    {p.equipoLocal?.nombre || p.nombreLocal || "Sin asignar"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">
                    LOCAL
                  </p>
                </div>

                <div className="px-4 flex flex-col items-center">
                  <span className="text-blue-500 font-black italic text-xl">
                    VS
                  </span>
                  <div className="text-white font-bold text-lg mt-1">
                    {p.golesLocal ?? 0} - {p.golesVisitante ?? 0}
                  </div>
                </div>

                <div className="flex-1 text-center">
                  <p className="font-bold text-white text-sm truncate">
                    {p.equipoVisitante?.nombre ||
                      p.nombreVisitante ||
                      "Sin asignar"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">
                    VISITANTE
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-800/50 pt-4">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">📍 Lugar:</span>
                  <span className="text-slate-300 font-medium">
                    {p.lugar || "Sin definir"}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">🕒 Fecha:</span>
                  <span className="text-blue-400 font-semibold">
                    {formatearFecha(p.fechaHora || p.fecha_hora)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <Badge variant={p.estado === "FINALIZADO" ? "success" : "info"}>
                  {p.estado || "PROGRAMADO"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalCalendar;
