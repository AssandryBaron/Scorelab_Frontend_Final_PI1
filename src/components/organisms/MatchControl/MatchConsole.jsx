import React, { useState, useEffect, useRef } from "react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";

const MatchConsole = ({
  partidoId,
  titularesLocal,
  titularesVisitante,
  infoPartido,
}) => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [periodo, setPeriodo] = useState(1);
  const [partidoFinalizado, setPartidoFinalizado] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [marcador, setMarcador] = useState({ local: 0, visitante: 0 });
  const timerRef = useRef(null);

  // 1. Carga inicial y sincronización
  useEffect(() => {
    if (infoPartido.estado === "FINALIZADO") setPartidoFinalizado(true);
    setMarcador({
      local: infoPartido.golesLocal || 0,
      visitante: infoPartido.golesVisitante || 0,
    });
    fetchCronologia();
  }, [partidoId, infoPartido]);

  // 2. Lógica del Cronómetro
  useEffect(() => {
    if (activo && !partidoFinalizado) {
      timerRef.current = setInterval(() => setSegundos((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [activo, partidoFinalizado]);

  const minutoActual = Math.floor(segundos / 60) + (periodo === 1 ? 1 : 46);

  // 3. Obtener Cronología
  const fetchCronologia = async () => {
    try {
      const res = await api.get(`/control-partido/${partidoId}/cronologia`);
      setEventos(res.data?.datos || []);
    } catch (error) {
      console.error("Error cargando cronología:", error);
    }
  };

  // 4. Registro de eventos
  const registrarEvento = async (jugadorId, tipo, equipo, nombreJugador) => {
    if (partidoFinalizado) return;

    const nuevoEvento = {
      minuto: minutoActual,
      tipo,
      jugador: { id: jugadorId, nombre: nombreJugador },
    };

    setEventos((prev) => [nuevoEvento, ...prev]);

    if (tipo === "GOL") {
      setMarcador((prev) => ({ ...prev, [equipo]: prev[equipo] + 1 }));
    }

    try {
      await api.post(`/control-partido/${partidoId}/evento`, {
        jugadorId,
        minuto: minutoActual,
        tipo,
      });
      fetchCronologia();
    } catch (error) {
      console.error("Error al registrar evento:", error);
      fetchCronologia();
    }
  };

  // 5. Finalizar Partido (CORREGIDO PARA NO CERRAR SESIÓN)
  const finalizarPartidoDefinitivamente = async () => {
    const confirmacion = window.confirm(
      `¿Deseas finalizar el partido con marcador final ${marcador.local} - ${marcador.visitante}?`,
    );

    if (confirmacion) {
      try {
        setActivo(false);
        // Detenemos el cronómetro antes de la petición
        clearInterval(timerRef.current);

        await api.post(`/partidos/${partidoId}/finalizar`, {
          golesLocal: marcador.local,
          golesVisitante: marcador.visitante,
        });

        setPartidoFinalizado(true);
        alert("¡Partido finalizado con éxito!");

        // ✅ REDIRECCIÓN AL DASHBOARD SIN CERRAR SESIÓN
        // Asegúrate de que esta ruta sea la correcta en tu App.js
        navigate("/dashboard-organizador");
      } catch (error) {
        console.error("Error al finalizar:", error);
        // Si sale 403 aquí, es un tema de seguridad en el backend, no del front
        alert("Hubo un problema al guardar el resultado final.");
      }
    }
  };

  const manejarSiguienteFase = () => {
    if (periodo === 1) {
      if (window.confirm("¿Terminar primer tiempo?")) {
        setPeriodo(2);
        setSegundos(0);
        setActivo(false);
      }
    } else {
      finalizarPartidoDefinitivamente();
    }
  };

  const renderJugador = (j, equipo) => {
    const evsJugador = eventos.filter(
      (ev) => ev.jugador?.id === j.id || ev.jugadorId === j.id,
    );
    const amarillas = evsJugador.filter(
      (ev) => ev.tipo === "TARJETA_AMARILLA",
    ).length;
    const rojaDirecta = evsJugador.some((ev) => ev.tipo === "TARJETA_ROJA");
    const estaExpulsado = amarillas >= 2 || rojaDirecta;

    return (
      <div
        key={j.id}
        className={`flex items-center justify-between p-2 rounded-lg border mb-2 transition-all ${
          estaExpulsado || partidoFinalizado
            ? "opacity-50 bg-slate-900 border-transparent"
            : "bg-slate-950 border-slate-800"
        }`}
      >
        <span
          className={`text-xs font-medium ${estaExpulsado ? "text-red-500" : "text-white"}`}
        >
          {j.nombre} {estaExpulsado && "🟥"}
        </span>
        <div className="flex gap-1">
          {!estaExpulsado && !partidoFinalizado && (
            <>
              <button
                onClick={() => registrarEvento(j.id, "GOL", equipo, j.nombre)}
                className="p-1 bg-green-600/20 text-green-500 rounded text-xs hover:bg-green-600/40"
              >
                ⚽
              </button>
              <button
                onClick={() =>
                  registrarEvento(j.id, "TARJETA_AMARILLA", equipo, j.nombre)
                }
                className="p-1 bg-yellow-500/20 text-yellow-500 rounded text-xs hover:bg-yellow-500/40"
              >
                🟨
              </button>
              <button
                onClick={() =>
                  registrarEvento(j.id, "TARJETA_ROJA", equipo, j.nombre)
                }
                className="p-1 bg-red-600/20 text-red-500 rounded text-xs hover:bg-red-600/40"
              >
                🟥
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 ${partidoFinalizado ? "grayscale-[0.4]" : ""}`}
    >
      {/* MARCADOR */}
      <div className="lg:col-span-12 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl flex justify-around items-center relative overflow-hidden">
        {partidoFinalizado && (
          <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center z-20 backdrop-blur-sm">
            <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white/20">
              PARTIDO FINALIZADO
            </span>
          </div>
        )}
        <div className="text-center">
          <h2 className="text-white font-bold text-xl mb-1">
            {infoPartido.equipoLocal.nombre}
          </h2>
          <div className="text-7xl font-black text-white">{marcador.local}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-blue-500 uppercase mb-2">
            {periodo === 1 ? "1er Tiempo" : "2do Tiempo"} - Min {minutoActual}
          </div>
          <div className="text-5xl font-mono text-blue-400 font-bold bg-black px-6 py-3 rounded-2xl border border-blue-500/30">
            {Math.floor(segundos / 60)
              .toString()
              .padStart(2, "0")}
            :{(segundos % 60).toString().padStart(2, "0")}
          </div>
          <div className="flex gap-3 mt-5">
            {!partidoFinalizado && (
              <>
                <button
                  onClick={() => setActivo(!activo)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm border transition-colors ${
                    activo
                      ? "bg-red-500/20 text-red-500 border-red-500/50"
                      : "bg-green-500/20 text-green-500 border-green-500/50"
                  }`}
                >
                  {activo ? "⏸ PAUSAR" : "▶ INICIAR"}
                </button>
                <button
                  onClick={manejarSiguienteFase}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-sm border border-slate-600"
                >
                  {periodo === 1 ? "FIN 1T" : "FINALIZAR"}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-white font-bold text-xl mb-1">
            {infoPartido.equipoVisitante.nombre}
          </h2>
          <div className="text-7xl font-black text-white">
            {marcador.visitante}
          </div>
        </div>
      </div>

      {/* JUGADORES Y CRONOLOGÍA */}
      <div className="lg:col-span-3">
        <h3 className="text-slate-500 text-xs font-bold uppercase mb-3 px-2">
          Local
        </h3>
        <div className="max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
          {titularesLocal.map((j) => renderJugador(j, "local"))}
        </div>
      </div>

      <div className="lg:col-span-6 bg-slate-900/50 rounded-2xl p-4 border border-slate-800 h-[500px] flex flex-col">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <span className="text-blue-500">⏱️</span> Cronología
        </h3>
        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {eventos.length === 0 ? (
            <div className="text-slate-600 text-center mt-10 italic text-sm">
              Esperando eventos...
            </div>
          ) : (
            eventos.map((ev, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border-l-4 border-blue-600 animate-in fade-in"
              >
                <span className="text-blue-500 font-black min-w-[30px]">
                  {ev.minuto}'
                </span>
                <span className="text-white text-sm font-bold flex-1">
                  {ev.tipo.replace("_", " ")}
                </span>
                <span className="text-slate-400 text-xs">
                  — {ev.jugador?.nombre}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-3">
        <h3 className="text-slate-500 text-xs font-bold uppercase mb-3 px-2 text-right">
          Visitante
        </h3>
        <div className="max-h-[500px] overflow-y-auto pl-1 custom-scrollbar">
          {titularesVisitante.map((j) => renderJugador(j, "visitante"))}
        </div>
      </div>
    </div>
  );
};

export default MatchConsole;
