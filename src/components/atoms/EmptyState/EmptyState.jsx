import React from 'react';

/**
 * Átomo: EmptyState
 * Muestra un mensaje cuando no hay datos disponibles.
 */
const EmptyState = ({ message = 'No hay datos disponibles.', icon = '✨', className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 px-8 border border-dashed border-slate-700 rounded-xl text-center ${className}`}
    >
      <span className="text-4xl">{icon}</span>
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
