import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import PlayerRow from "../../molecules/PlayerRow/PlayerRow";
import Input from "../../atoms/Input/Input";
import Select from "../../atoms/Select/Select";
import Button from "../../atoms/Button/Button";
import EmptyState from "../../atoms/EmptyState/EmptyState";
import Spinner from "../../atoms/Spinner/Spinner";
import Badge from "../../atoms/Badge/Badge";

const POSICION_OPTIONS = [
  { value: "Portero", label: "Portero" },
  { value: "Defensa", label: "Defensa" },
  { value: "Mediocampista", label: "Mediocampista" },
  { value: "Delantero", label: "Delantero" },
];

const FILA_VACIA = {
  nombre: "",
  documento: "",
  posicion: "",
  numeroCamiseta: "",
};

const PlayerRoster = ({ equipo, onBack }) => {
  const [jugadores, setJugadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filas, setFilas] = useState([{ ...FILA_VACIA }]);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Efecto para limpiar mensajes automáticamente después de 5 segundos
  useEffect(() => {
    if (mensaje || error) {
      const timer = setTimeout(() => {
        setMensaje("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje, error]);

  const cargarPlantilla = async () => {
    try {
      const res = await api.get(`/jugadores/equipo/${equipo.id}`);
      const lista = res.data?.datos || res.data?.data || [];
      setJugadores(lista);
    } catch (err) {
      setError("Error al cargar la plantilla.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPlantilla();
  }, [equipo.id]);

  const handleFilaChange = (index, field) => (e) => {
    setFilas((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: e.target.value } : f)),
    );
  };

  const agregarFila = () => setFilas((prev) => [...prev, { ...FILA_VACIA }]);

  const eliminarFila = (index) =>
    setFilas((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setEnviando(true);

    try {
      // Convertimos el dorsal a número antes de enviar
      const datosAEnviar = filas.map((f) => ({
        ...f,
        numeroCamiseta: f.numeroCamiseta ? Number(f.numeroCamiseta) : null,
      }));

      // Petición al nuevo endpoint de lote
      await api.post(`/jugadores/lote/${equipo.id}`, datosAEnviar);

      setMensaje("✅ Jugadores inscritos correctamente.");
      setFilas([{ ...FILA_VACIA }]);
      cargarPlantilla(); // Recargar la tabla superior
    } catch (err) {
      // 🌟 CAPTURA DEL ERROR ESPECÍFICO DEL BACKEND (Dorsal o Cédula duplicada)
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "Error al inscribir jugadores.";
      setError(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="muted" size="sm" onClick={onBack}>
          ⬅ Volver
        </Button>
        <div>
          <h2 className="text-lg font-bold text-white">{equipo.nombre}</h2>
          <p className="text-slate-500 text-sm">Gestión de plantilla</p>
        </div>
        <Badge variant="info" className="ml-auto">
          {jugadores.length} jugadores
        </Badge>
      </div>

      {/* Plantilla Actual */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Plantilla actual
        </h3>
        {cargando ? (
          <div className="flex justify-center py-10">
            <Spinner text="Cargando plantilla..." />
          </div>
        ) : jugadores.length === 0 ? (
          <EmptyState
            icon="👤"
            message="Aún no hay jugadores inscritos en este equipo."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Documento</th>
                  <th className="px-4 py-3 text-left">Posición</th>
                  <th className="px-4 py-3 text-left">Camiseta</th>
                </tr>
              </thead>
              <tbody>
                {jugadores.map((j) => (
                  <PlayerRow key={j.id || j.documento} jugador={j} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Formulario de Inscripción */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Inscribir jugadores
        </h3>

        {/* Notificaciones */}
        {mensaje && (
          <div className="mb-4 bg-green-900/20 border border-green-600/40 text-green-400 text-sm px-4 py-3 rounded-lg animate-pulse">
            {mensaje}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-900/20 border border-red-500/40 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Documento</th>
                  <th className="px-4 py-3 text-left">Posición</th>
                  <th className="px-4 py-3 text-left">Camiseta #</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filas.map((fila, index) => (
                  <tr key={index} className="border-t border-slate-800">
                    <td className="px-3 py-2">
                      <Input
                        placeholder="Nombre completo"
                        value={fila.nombre}
                        onChange={handleFilaChange(index, "nombre")}
                        required
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        placeholder="CC / Pasaporte"
                        value={fila.documento}
                        onChange={handleFilaChange(index, "documento")}
                        required
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Select
                        value={fila.posicion}
                        onChange={handleFilaChange(index, "posicion")}
                        options={POSICION_OPTIONS}
                        placeholder="Posición"
                        required
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        placeholder="#"
                        value={fila.numeroCamiseta}
                        onChange={handleFilaChange(index, "numeroCamiseta")}
                        required
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      {filas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarFila(index)}
                          className="text-red-500 hover:text-red-400 text-xl font-bold"
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" type="button" onClick={agregarFila}>
              + Agregar otra fila
            </Button>
            <Button variant="success" type="submit" disabled={enviando}>
              {enviando ? "Guardando plantilla..." : "💾 Guardar jugadores"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default PlayerRoster;
