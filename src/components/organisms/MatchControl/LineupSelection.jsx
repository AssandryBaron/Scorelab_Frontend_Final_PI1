import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import Button from "../../atoms/Button/Button";
import Spinner from "../../atoms/Spinner/Spinner";

const LineupSelection = ({ partidoId, equipoId, nombreEquipo, onComplete }) => {
  const [jugadores, setJugadores] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Cargar jugadores del equipo
  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const res = await api.get(`/jugadores/equipo/${equipoId}`);
        const data = res.data?.datos || res.data || [];
        setJugadores(data);
      } catch (error) {
        console.error("Error cargando jugadores:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchJugadores();
  }, [equipoId]);

  // 2. Manejar la selección (Máximo 11)
  const toggleJugador = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((jId) => jId !== id));
    } else {
      if (seleccionados.length < 11) {
        setSeleccionados([...seleccionados, id]);
      } else {
        alert("Ya seleccionaste los 11 titulares.");
      }
    }
  };

  // 3. Guardar en el Backend y pasar a la Consola
  const confirmarPlantilla = async () => {
    if (seleccionados.length !== 11) {
      return alert("Debes seleccionar exactamente 11 jugadores.");
    }

    try {
      /**
       * ✅ CORRECCIÓN CRÍTICA PARA EL ERROR 400:
       * El backend ahora espera un objeto PlantillaRequest.
       * La propiedad DEBE llamarse 'jugadorIds' para coincidir con el DTO de Java.
       */
      const dataParaBackend = {
        jugadorIds: seleccionados, // Antes decía 'jugadores'
      };

      await api.post(
        `/control-partido/${partidoId}/plantilla`,
        dataParaBackend,
      );

      // Obtenemos los objetos completos para la MatchConsole
      const objetosSeleccionados = jugadores.filter((j) =>
        seleccionados.includes(j.id),
      );

      // Avanzamos a la consola
      onComplete(objetosSeleccionados);
    } catch (error) {
      console.error("Error al guardar plantilla:", error);
      // Si el error es 403, revisa el rol. Si es 400, revisa el nombre del campo.
      alert(
        error.response?.data?.mensaje ||
          "Error al guardar la plantilla en el servidor.",
      );
    }
  };

  if (cargando)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-2xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">
            Selección de Titulares
          </h3>
          <p className="text-blue-400 font-medium text-sm">{nombreEquipo}</p>
        </div>
        <div className="bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-xs font-bold border border-blue-600/30">
          {seleccionados.length} / 11 Seleccionados
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 mb-6 custom-scrollbar">
        {jugadores.length === 0 ? (
          <p className="text-slate-500 italic col-span-2 text-center py-10">
            No hay jugadores registrados en este equipo.
          </p>
        ) : (
          jugadores.map((j) => (
            <div
              key={j.id}
              onClick={() => toggleJugador(j.id)}
              className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between group ${
                seleccionados.includes(j.id)
                  ? "bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "bg-slate-950 border-slate-800 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    seleccionados.includes(j.id)
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                  }`}
                >
                  {j.numero || "—"}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    {j.nombre}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    {j.posicion || "Jugador"}
                  </span>
                </div>
              </div>
              {seleccionados.includes(j.id) && (
                <span className="text-blue-400 text-xl animate-scale-in">
                  ✓
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <Button
        onClick={confirmarPlantilla}
        variant="primary"
        className="w-full py-4 text-lg font-bold shadow-lg shadow-blue-900/20"
        disabled={seleccionados.length !== 11}
      >
        Confirmar Plantilla y Continuar
      </Button>
    </div>
  );
};

export default LineupSelection;
