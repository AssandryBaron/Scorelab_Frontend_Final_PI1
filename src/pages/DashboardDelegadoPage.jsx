import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Users, X, Trophy, ArrowLeft } from "lucide-react";
import api from "../api/api";

// 🚀 Corregido: Ya no importamos DelegadoLayout aquí para evitar la duplicación de pantallas
import TeamGrid from "../components/organisms/TeamGrid/TeamGrid";
import RegisterTeamForm from "../components/organisms/RegisterTeamForm/RegisterTeamForm";
import PlayerRoster from "../components/organisms/PlayerRoster/PlayerRoster";

const DashboardDelegadoPage = () => {
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para cerrar sesión y limpiar todo si el token expira
  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  // Cargar equipos del delegado conectado
  const cargarEquipos = useCallback(async () => {
    setCargando(true);
    try {
      // Esta petición usa el interceptor para enviar el token del delegado actual
      const res = await api.get("/equipos/mis-equipos");
      setEquipos(res.data?.datos ?? []);
    } catch (error) {
      console.error("❌ Error al cargar equipos:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setCargando(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  const handleEquipoCreado = () => {
    setMostrarModal(false);
    cargarEquipos();
  };

  // 🔄 VISTA DE DETALLE: Gestión de Jugadores (Inyectada de manera plana sin romper el layout)
  if (equipoSeleccionado) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEquipoSeleccionado(null)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900 hover:text-white border border-slate-800 px-3 py-2 rounded-xl transition-all"
          >
            <ArrowLeft size={14} />
            Volver a Mis Equipos
          </button>
        </div>
        <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-md shadow-2xl">
          <PlayerRoster
            equipo={equipoSeleccionado}
            onBack={() => setEquipoSeleccionado(null)}
          />
        </div>
      </div>
    );
  }

  // 🏠 VISTA PRINCIPAL (GRID DE EQUIPOS - SIN CONTENEDORES MAESTROS DUPLICADOS)
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner de título y acción con estética unificada */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="text-blue-500" size={28} />
            Mis Equipos Administrados
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Gestiona tus clubes, inscripciones y las plantillas de jugadores en
            tiempo real
          </p>
        </div>

        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <PlusCircle size={16} />
          Inscribir Nuevo Equipo
        </button>
      </div>

      {/* Grid de Equipos contenedor */}
      <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-md shadow-2xl">
        <TeamGrid
          equipos={equipos}
          loading={cargando}
          onGestionarJugadores={(equipo) => setEquipoSeleccionado(equipo)}
        />
      </div>

      {/* 📋 MODAL DE INSCRIPCIÓN PREMIUM */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMostrarModal(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-slate-950 border border-slate-800/80 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Brillo superior neón */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            <div className="p-5 border-b border-slate-900 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Trophy className="text-blue-400" size={18} />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Nueva Inscripción de Equipo
                </h3>
              </div>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-900 rounded-xl transition-colors border border-transparent hover:border-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 bg-slate-950">
              <RegisterTeamForm onSuccess={handleEquipoCreado} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDelegadoPage;
