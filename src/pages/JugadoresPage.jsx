import React, { useState, useEffect } from "react";
// Importamos el icono de silueta (UserCircle) de la librería de iconos
import { UserCircle } from "lucide-react";
// Verifica que esta ruta sea correcta hacia tu archivo api.js
import api from "../api/api";

const JugadoresPage = () => {
  const [jugadores, setJugadores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const res = await api.get("/jugadores/todos");
        // Ajustamos según la estructura de tu respuesta ApiResponse de Spring
        setJugadores(res.data?.datos || []);
      } catch (error) {
        console.error("Error al cargar la base de jugadores:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchJugadores();
  }, []);

  // ✅ Función para determinar el color y estilo según la posición (Actualizada)
  const getPosicionStyles = (posicion) => {
    const pos = posicion?.toUpperCase() || "";
    if (pos.includes("PORTERO") || pos.includes("ARQUERO")) {
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"; // Amarillo
    }
    if (pos.includes("DEFENSA")) {
      return "bg-orange-600/10 text-orange-500 border-orange-500/20"; // 🔶 NUEVO: Naranja
    }
    if (pos.includes("MEDIOCAMPISTA") || pos.includes("VOLANTE")) {
      return "bg-green-500/10 text-green-500 border-green-500/20"; // Verde
    }
    if (pos.includes("DELANTERO")) {
      return "bg-red-600/10 text-red-500 border-red-500/20"; // 🔴 NUEVO: Rojo
    }
    return "bg-slate-800 text-slate-400 border-slate-700"; // Por defecto
  };

  const jugadoresFiltrados = jugadores.filter(
    (j) =>
      j.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      j.nombreEquipo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      j.documento?.includes(busqueda),
  );

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64 p-10">
        <div className="text-blue-500 animate-pulse font-bold flex gap-3 items-center">
          <UserCircle className="animate-spin" size={20} />
          Sincronizando base de jugadores...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in text-slate-200">
      {/* Encabezado y buscador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            Fichas Técnicas
          </h1>
          <p className="text-slate-500 text-sm">
            Registro centralizado de deportistas ScoreLab
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-600">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, equipo o DNI..."
            className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600/50 transition-all shadow-inner"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Jugadores */}
      <div className="bg-slate-950/50 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/60 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-800/80">
                <th className="px-6 py-5 font-bold">Deportista</th>
                <th className="px-6 py-5 font-bold">Identificación</th>
                <th className="px-6 py-5 font-bold">Club Actual</th>
                <th className="px-6 py-5 font-bold">Demarcación</th>
                <th className="px-6 py-5 font-bold text-center">Dorsal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {jugadoresFiltrados.length > 0 ? (
                jugadoresFiltrados.map((j) => (
                  <tr
                    key={j.id}
                    className="hover:bg-slate-900/40 transition-colors group"
                  >
                    {/* Celda del Jugador: Silueta + Nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* ✅ NUEVO: Círculo con Icono de Silueta (UserCircle) coloreado dinámicamente */}
                        <div
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${getPosicionStyles(
                            j.posicion,
                          )}`}
                        >
                          <UserCircle size={28} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">
                            {j.nombre}
                          </span>
                          <span className="text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                            Miembro Registrado
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-sm font-mono tracking-tight">
                      {j.documento || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-medium">
                        {j.nombreEquipo || "Agente Libre"}
                      </span>
                    </td>

                    {/* Celda de Posición: Badge coloreado dinámicamente */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold border uppercase tracking-wider ${getPosicionStyles(
                          j.posicion,
                        )}`}
                      >
                        {j.posicion || "Sin Definir"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="text-blue-400 font-extrabold text-lg bg-blue-950 px-3 py-1.5 rounded-lg border border-blue-900/50 shadow-md">
                        {j.numeroCamiseta || "--"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-24 text-center text-slate-600 italic"
                  >
                    {busqueda
                      ? "No hay coincidencias para la búsqueda."
                      : "La base de datos de jugadores está vacía."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JugadoresPage;
