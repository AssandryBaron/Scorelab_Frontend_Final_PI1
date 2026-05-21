import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Award,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

const SidebarDelegado = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/delegado/dashboard" },
    { icon: Users, label: "Mis Equipos", path: "/delegado/equipos" },
    {
      icon: Trophy,
      label: "Tablas de Posiciones",
      path: "/delegado/posiciones",
    },
    {
      icon: Award,
      label: "Estadísticas del Torneo",
      path: "/delegado/estadisticas",
    },
    {
      icon: Calendar,
      label: "Calendario Global",
      path: "/delegado/calendario",
    },
    { icon: Settings, label: "Configuración", path: "/delegado/configuracion" },
  ];

  return (
    <div className="w-72 bg-slate-950 border-r border-slate-800/60 h-screen sticky top-0 flex flex-col justify-between pb-8">
      <div>
        {/* Branding unificado */}
        <div className="p-8">
          <h2 className="text-2xl font-black text-white tracking-tighter italic">
            SCORE<span className="text-blue-500">LAB</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
            Panel de Delegado
          </p>
        </div>

        {/* Links de Navegación */}
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/delegado/dashboard" &&
                location.pathname === "/delegado");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] border-l-2 border-blue-500"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
                }`}
              >
                <item.icon
                  size={20}
                  className={isActive ? "text-blue-500" : ""}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botón Salir */}
      <div className="px-4">
        <button className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
          <LogOut size={20} />
          Salir del Sistema
        </button>
      </div>
    </div>
  );
};

export default SidebarDelegado;
