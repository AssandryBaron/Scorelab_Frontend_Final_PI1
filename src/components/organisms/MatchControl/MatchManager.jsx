import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import LineupSelection from "./LineupSelection";
import MatchConsole from "./MatchConsole";
import Spinner from "../../atoms/Spinner/Spinner";

const MatchManager = ({ partidoId }) => {
  const [partido, setPartido] = useState(null);
  const [paso, setPaso] = useState(1); // 1: Local, 2: Visitante, 3: Consola
  const [titularesLocal, setTitularesLocal] = useState([]);
  const [titularesVisitante, setTitularesVisitante] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatosPartido = async () => {
      try {
        setCargando(true);
        setError(null);

        // Solo pedimos los datos básicos del partido para empezar
        const res = await api.get(`/partidos/${partidoId}`);
        const data = res.data?.datos || res.data;

        if (!data) {
          setError("No se encontraron datos para este partido.");
        } else {
          setPartido(data);
        }
      } catch (e) {
        console.error("Error cargando partido:", e);
        // Si el error es 403, el mensaje ayudará a identificarlo
        setError(
          e.response?.status === 403
            ? "Error 403: No tienes permisos para gestionar este partido."
            : "Error al conectar con el servidor.",
        );
      } finally {
        setCargando(false);
      }
    };

    if (partidoId) {
      fetchDatosPartido();
    }
  }, [partidoId]);

  if (cargando)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner />
        <p className="text-slate-400 mt-4 animate-pulse">
          Cargando datos del encuentro...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-900/50 rounded-3xl border border-red-900/30 p-10">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-white text-xl font-bold mb-2">
          ¡Ups! Algo salió mal
        </h2>
        <p className="text-slate-400 text-center max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );

  if (!partido)
    return (
      <div className="text-white text-center p-20">Partido no encontrado</div>
    );

  return (
    <div className="p-4 max-w-7xl mx-auto animate-fade-in">
      {/* Encabezado informativo */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">
          Control de Encuentro
        </h1>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="h-[1px] w-10 bg-slate-800"></span>
          <p className="text-blue-500 font-mono font-bold">ID: #{partidoId}</p>
          <span className="h-[1px] w-10 bg-slate-800"></span>
        </div>
      </div>

      {/* Flujo de Pasos */}
      <div className="max-w-4xl mx-auto">
        {paso === 1 && (
          <div className="animate-slide-up">
            <LineupSelection
              partidoId={partidoId}
              equipoId={partido.equipoLocal.id}
              nombreEquipo={`LOCAL: ${partido.equipoLocal.nombre}`}
              onComplete={(seleccionCompleta) => {
                setTitularesLocal(seleccionCompleta);
                setPaso(2);
              }}
            />
          </div>
        )}

        {paso === 2 && (
          <div className="animate-slide-up">
            <LineupSelection
              partidoId={partidoId}
              equipoId={partido.equipoVisitante.id}
              nombreEquipo={`VISITANTE: ${partido.equipoVisitante.nombre}`}
              onComplete={(seleccionCompleta) => {
                setTitularesVisitante(seleccionCompleta);
                setPaso(3);
              }}
            />
          </div>
        )}

        {paso === 3 && (
          <div className="animate-fade-in">
            <MatchConsole
              partidoId={partidoId}
              titularesLocal={titularesLocal}
              titularesVisitante={titularesVisitante}
              infoPartido={partido}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchManager;
