import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // 🚀 Importante para la navegación
import api from "../../../api/api";
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import Select from "../../atoms/Select/Select";
import Spinner from "../../atoms/Spinner/Spinner";
import Badge from "../../atoms/Badge/Badge";

const TournamentMatches = () => {
  const navigate = useNavigate(); // 🚀 Hook para navegar
  const [torneos, setTorneos] = useState([]);
  const [torneoId, setTorneoId] = useState("");
  const [partidos, setPartidos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [form, setForm] = useState({
    localId: "",
    visitanteId: "",
    fechaHora: "",
    lugar: "",
  });

  // 1. Cargar Torneos
  useEffect(() => {
    api.get("/torneos").then((res) => {
      const data = res.data?.datos || res.data || [];
      setTorneos(data.map((t) => ({ value: String(t.id), label: t.nombre })));
    });
  }, []);

  // 2. Cargar Equipos y Partidos
  const fetchData = useCallback(async (id) => {
    if (!id) return;
    setCargando(true);
    try {
      const [resE, resP] = await Promise.all([
        api.get(`/equipos/torneo/${id}`),
        api.get(`/partidos/torneo/${id}`),
      ]);
      setEquipos(resE.data?.datos || resE.data || []);
      setPartidos(resP.data?.datos || resP.data || []);
    } catch (e) {
      console.error("Error al cargar datos", e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (torneoId) fetchData(torneoId);
  }, [torneoId, fetchData]);

  const formatearFechaSimple = (fechaStr) => {
    if (!fechaStr) return "Por definir";
    const d = new Date(fechaStr.replace(" ", "T"));
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resolverNombre = (p, tipo) => {
    const id =
      tipo === "local"
        ? p.equipoLocal?.id || p.equipoLocalId || p.localId
        : p.equipoVisitante?.id || p.equipoVisitanteId || p.visitanteId;

    if (!id) return "Sin asignar";
    const eq = equipos.find((e) => String(e.id) === String(id));
    return eq ? eq.nombre : `ID #${id}`;
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (form.localId === form.visitanteId)
      return alert("Selecciona equipos diferentes");

    setEnviando(true);
    const payload = {
      torneoId: parseInt(torneoId),
      localId: parseInt(form.localId),
      visitanteId: parseInt(form.visitanteId),
      fechaHora: form.fechaHora,
      lugar: form.lugar,
    };

    try {
      await api.post("/partidos/programar", payload);
      setForm({ localId: "", visitanteId: "", fechaHora: "", lugar: "" });
      fetchData(torneoId);
    } catch (err) {
      console.error(err);
      alert("Error al guardar. Verifica la sesión.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-xs">
        <Select
          label="🏆 Seleccionar Torneo"
          options={torneos}
          value={torneoId}
          onChange={(e) => setTorneoId(e.target.value)}
        />
      </div>

      {torneoId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-fit sticky top-6">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              📅 Programar Encuentro
            </h3>
            <form onSubmit={handleGuardar} className="space-y-5">
              <Select
                label="Equipo Local"
                options={equipos.map((e) => ({
                  value: String(e.id),
                  label: e.nombre,
                }))}
                value={form.localId}
                onChange={(e) => setForm({ ...form, localId: e.target.value })}
                required
              />
              <Select
                label="Equipo Visitante"
                options={equipos.map((e) => ({
                  value: String(e.id),
                  label: e.nombre,
                }))}
                value={form.visitanteId}
                onChange={(e) =>
                  setForm({ ...form, visitanteId: e.target.value })
                }
                required
              />
              <Input
                label="Fecha y Hora"
                type="datetime-local"
                value={form.fechaHora}
                onChange={(e) =>
                  setForm({ ...form, fechaHora: e.target.value })
                }
                required
                style={{ colorScheme: "dark" }}
              />
              <Input
                label="Lugar / Cancha"
                placeholder="Ej: Cancha Sintética Bombonera"
                value={form.lugar}
                onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                required
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                disabled={enviando}
              >
                {enviando ? "Guardando..." : "Confirmar Partido"}
              </Button>
            </form>
          </section>

          <section className="lg:col-span-2 space-y-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">
              Próximos Encuentros
            </h3>
            {cargando ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : partidos.length === 0 ? (
              <div className="text-slate-500 italic p-10 border border-dashed border-slate-800 rounded-2xl text-center">
                No hay partidos programados.
              </div>
            ) : (
              partidos.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all shadow-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex-1 text-center">
                      <p className="text-white font-bold">
                        {resolverNombre(p, "local")}
                      </p>
                    </div>
                    <div className="px-4 text-blue-500 font-black italic">
                      VS
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-white font-bold">
                        {resolverNombre(p, "visitante")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-800/50 pt-4">
                    <div className="text-[11px] text-slate-400 space-y-1">
                      <p>
                        🕒 {formatearFechaSimple(p.fechaHora || p.fecha_hora)}
                      </p>
                      <p>📍 {p.lugar || "Sede por definir"}</p>
                    </div>

                    {/* 🚀 BOTÓN DINÁMICO DE CONTROL */}
                    <div className="flex gap-2">
                      <Badge
                        variant={p.estado === "FINALIZADO" ? "success" : "info"}
                      >
                        {p.estado || "PROGRAMADO"}
                      </Badge>

                      {p.estado !== "FINALIZADO" && (
                        <button
                          onClick={() => navigate(`/control-partido/${p.id}`)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                        >
                          Gestionar ⏱️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default TournamentMatches;
