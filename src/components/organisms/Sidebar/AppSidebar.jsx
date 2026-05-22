import React from "react";
import { LogOut } from "lucide-react";

/**
 * AppSidebar — Componente de sidebar unificado para todos los roles.
 *
 * Props:
 *   role: "ORGANIZADOR" | "DELEGADO" | "ESPECTADOR"
 *   roleLabel: string — texto descriptivo del rol
 *   accentColor: "blue" | "green" | "violet"  (default "blue")
 *   menuItems: Array<{ id: string, label: string, icon: LucideIcon }>
 *   activeTab: string
 *   onTabChange: (id: string) => void
 *   onLogout: () => void          — null para espectador (muestra "Volver")
 *   logoutLabel: string           — default "Cerrar Sesión"
 */

const ACCENT = {
  blue:   { active: "bg-blue-600 text-white shadow-lg shadow-blue-500/25",   dot: "bg-blue-500",   badge: "text-blue-400", icon: "text-white" },
  green:  { active: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25", dot: "bg-emerald-500", badge: "text-emerald-400", icon: "text-white" },
  violet: { active: "bg-violet-600 text-white shadow-lg shadow-violet-500/25", dot: "bg-violet-500", badge: "text-violet-400", icon: "text-white" },
};

const AppSidebar = ({
  role = "ORGANIZADOR",
  roleLabel = "Panel",
  accentColor = "blue",
  menuItems = [],
  activeTab,
  onTabChange,
  onLogout,
  logoutLabel = "Cerrar Sesión",
}) => {
  const accent = ACCENT[accentColor] ?? ACCENT.blue;

  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800/60 flex flex-col fixed left-0 top-0 z-50">
      {/* ── Branding ─────────────────────────────────────────────── */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-2xl font-black text-white tracking-tighter italic leading-none">
          SCORE<span className="text-blue-500">LAB</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${accent.dot}`} />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            {roleLabel}
          </p>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div className="mx-4 h-px bg-slate-800/60 mb-4" />

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {menuItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? accent.active
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? accent.icon
                    : "text-slate-500 group-hover:text-slate-300 transition-colors"
                }
              />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Logout / Back ────────────────────────────────────────── */}
      <div className="p-3 border-t border-slate-800/60">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>{logoutLabel}</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
