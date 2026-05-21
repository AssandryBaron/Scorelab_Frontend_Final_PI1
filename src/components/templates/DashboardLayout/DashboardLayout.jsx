import React from 'react';

/**
 * Template: DashboardLayout
 * Layout base para todos los dashboards.
 * Provee el fondo, máximo ancho y padding consistente.
 * El AppHeader se pasa como children o se instancia en cada página.
 */
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Fondo decorativo sutil */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[1px] bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
