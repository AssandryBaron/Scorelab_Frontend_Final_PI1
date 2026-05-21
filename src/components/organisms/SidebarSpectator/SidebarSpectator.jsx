import React from "react";
import { CalendarDays, Table2, Target, LogIn, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SidebarSpectator = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "calendario", label: "Calendario Global", icon: CalendarDays },
    { id: "posiciones", label: "Tablas de Posiciones", icon: Table2 },
    { id: "goleadores", label: "Estadísticas Goleadores", icon: Target },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-50">
      {/* Bloque Superior: Branding de la Plataforma */}
      <div className="p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-black tracking-tighter italic text-white flex items-center gap-2">
            SCORE<span className="text-[#00FF9C]">LAB</span>
          </h1>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mt-1">
            <Globe size={11} className="text-[#00FF9C]" /> Portal Público
          </span>
        </div>

        {/* Menú de Navegación Vertical */}
        <nav className="mt-10 flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200
                  ${
                    isSelected
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent"
                  }`}
              >
                <Icon
                  size={16}
                  className={isSelected ? "text-blue-400" : "text-slate-400"}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bloque Inferior: Retorno Seguro al Login */}
      <div className="p-4 border-t border-slate-900">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95"
        >
          <LogIn size={15} className="text-[#00FF9C]" />
          Volver al Login
        </button>
      </div>
    </div>
  );
};

export default SidebarSpectator;
