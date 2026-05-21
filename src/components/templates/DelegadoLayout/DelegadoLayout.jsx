import React, { useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarDelegado from "../../organisms/SidebarDelegado/SidebarDelegado";

const DelegadoLayout = () => {
  const navigate = useNavigate();

  // Recuperar datos de usuario de forma segura directamente en el Layout
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const nombreUsuario =
    userObj.nombre || localStorage.getItem("nombre") || "Delegado";

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 antialiased">
      {/* Sidebar Fijo Izquierdo */}
      <SidebarDelegado />

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header Superior — Estilo Premium ScoreLab */}
        <header className="px-8 py-5 flex justify-between items-center bg-slate-950/40 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800/40">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Bienvenido, <span className="text-blue-400">{nombreUsuario}</span>{" "}
              👋
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              Gestión y Monitoreo de Equipos Inscritos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20">
              Rol: Delegado de Equipo
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* 🚀 AQUÍ SE INYECTARÁN LAS PÁGINAS HIJAS SIN RECARGAR EL LAYOUT */}
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DelegadoLayout;
