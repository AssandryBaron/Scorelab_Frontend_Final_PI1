import React from "react";
import {
  LayoutDashboard,
  Trophy,
  Users2,
  UserSquare2,
  Sword,
  Table2,
  BarChart3,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
    }`}
  >
    <Icon
      size={20}
      className={
        active ? "text-white" : "group-hover:scale-110 transition-transform"
      }
    />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const SidebarOrganizador = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "torneos", label: "Mis Torneos", icon: Trophy },
    { id: "equipos", label: "Validar Equipos", icon: Users2 },
    { id: "jugadores", label: "Base de Jugadores", icon: UserSquare2 },
    { id: "partidos", label: "Gestión de Partidos", icon: Sword },
    { id: "posiciones", label: "Tablas de Posiciones", icon: Table2 },
    { id: "estadisticas", label: "Estadísticas Goleadores", icon: BarChart3 },
    { id: "calendario", label: "Calendario Global", icon: CalendarDays },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col p-4 fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="px-4 py-8">
        <h1 className="text-2xl font-black text-white tracking-tighter italic">
          SCORE<span className="text-blue-500">LAB</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            Organizador
          </p>
        </div>
      </div>

      {/* Menú Scrollable */}
      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium text-sm">Salir del Sistema</span>
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `,
        }}
      />
    </aside>
  );
};

export default SidebarOrganizador;
