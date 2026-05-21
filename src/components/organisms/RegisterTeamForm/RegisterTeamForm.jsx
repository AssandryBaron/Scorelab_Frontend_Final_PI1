import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import FormField from "../../molecules/FormField/FormField";
import Select from "../../atoms/Select/Select";
import Button from "../../atoms/Button/Button";
import Spinner from "../../atoms/Spinner/Spinner";

const RegisterTeamForm = ({ onSuccess }) => {
  const [torneos, setTorneos] = useState([]);
  const [cargandoTorneos, setCargandoTorneos] = useState(true);

  // 🌟 CAMBIO 1: Cambiamos 'nombreEquipo' por 'nombre' para que coincida con el DTO de Java
  const [form, setForm] = useState({ nombre: "", torneoId: "" });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarTorneos = async () => {
      try {
        const res = await api.get("/torneos");
        const lista = res.data?.datos ?? [];
        setTorneos(lista.map((t) => ({ value: t.id, label: t.nombre })));
      } catch {
        setError("No se pudieron cargar los torneos disponibles.");
      } finally {
        setCargandoTorneos(false);
      }
    };
    cargarTorneos();
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    try {
      // 🌟 CAMBIO 2: Aseguramos que el torneoId se envíe como número y no como texto
      const dataAEnviar = {
        ...form,
        torneoId: Number(form.torneoId),
      };

      await api.post("/equipos/inscribir", dataAEnviar);

      setMensaje(
        "✅ Equipo inscrito exitosamente. Espera la aprobación del organizador.",
      );
      setForm({ nombre: "", torneoId: "" }); // Limpiamos con el nuevo nombre de campo
      onSuccess?.();
    } catch (err) {
      // Si el backend devuelve un mensaje de error específico, lo mostramos
      setError(err.response?.data?.mensaje || "Error al inscribir el equipo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-base font-bold text-white mb-5">
        ➕ Inscribir nuevo equipo
      </h2>

      {mensaje && (
        <div className="mb-4 bg-green-900/20 border border-green-600/40 text-green-400 text-sm px-4 py-3 rounded-lg">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-900/20 border border-red-500/40 text-red-400 text-sm px-4 py-3 rounded-lg">
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Nombre del equipo"
          type="text"
          placeholder="Ej. Los Campeones FC"
          // 🌟 CAMBIO 3: Usamos form.nombre
          value={form.nombre}
          onChange={handleChange("nombre")}
          required
        />

        <FormField label="Torneo" required>
          {cargandoTorneos ? (
            <Spinner text="Cargando torneos..." />
          ) : (
            <Select
              value={form.torneoId}
              onChange={handleChange("torneoId")}
              options={torneos}
              placeholder="-- Selecciona un torneo --"
            />
          )}
        </FormField>

        <Button
          type="submit"
          variant="success"
          disabled={cargando || cargandoTorneos}
          fullWidth
        >
          {cargando ? "Inscribiendo..." : "Inscribir Equipo"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterTeamForm;
