import React from 'react';

/**
 * Molécula: BrandHeader
 * Logo + nombre de la app + subtítulo.
 * Usado en las páginas de autenticación (Login y Register).
 */
const BrandHeader = ({ subtitle = 'Gestión de torneos de fútbol' }) => {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-3xl">
        ⚽
      </div>
      <h1 className="text-3xl font-black tracking-[0.2em] text-green-400">
        SCORELAB
      </h1>
      <p className="text-slate-500 text-sm">{subtitle}</p>
    </div>
  );
};

export default BrandHeader;
