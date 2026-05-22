import React from "react";
import AppSidebar from "../../organisms/Sidebar/AppSidebar";

/**
 * DashboardShell — Layout maestro unificado para los tres roles.
 *
 * Props:
 *   role / roleLabel / accentColor   → pasados al AppSidebar
 *   menuItems / activeTab / onTabChange / onLogout / logoutLabel
 *   headerTitle: string
 *   headerSubtitle: string
 *   headerActions: ReactNode        — botones del lado derecho del header
 *   children: ReactNode             — contenido principal
 */
const DashboardShell = ({
  // Sidebar
  role,
  roleLabel,
  accentColor = "blue",
  menuItems,
  activeTab,
  onTabChange,
  onLogout,
  logoutLabel,
  // Header
  headerTitle,
  headerSubtitle,
  headerActions,
  // Content
  children,
}) => {
  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      {/* ── Sidebar fijo ─────────────────────────────────────────── */}
      <AppSidebar
        role={role}
        roleLabel={roleLabel}
        accentColor={accentColor}
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
        logoutLabel={logoutLabel}
      />

      {/* ── Área de contenido (desplazada por el sidebar fijo) ───── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header pegajoso */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/50">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-tight">
              {headerTitle}
            </h1>
            {headerSubtitle && (
              <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-widest font-semibold">
                {headerSubtitle}
              </p>
            )}
          </div>

          {headerActions && (
            <div className="flex items-center gap-3">{headerActions}</div>
          )}
        </header>

        {/* Contenido principal */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
        </main>

        {/* Footer mínimo */}
        <footer className="px-8 py-3 border-t border-slate-900/60 flex justify-between items-center text-[10px] text-slate-700 font-bold uppercase tracking-wider">
          <span>ScoreLab © 2026</span>
          <span>Resultados en Tiempo Real</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardShell;
