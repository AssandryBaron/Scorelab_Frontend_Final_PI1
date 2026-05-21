import React from 'react';

/**
 * Átomo: Badge
 * Variantes: success | warning | info | muted
 * También acepta variant="auto" con prop `estado` para mapear automáticamente
 * desde los valores del backend (APROBADO, PENDIENTE, ACTIVO, etc.)
 */
const variantClasses = {
  success: 'bg-green-900/40 text-green-400 border-green-700/50',
  warning: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50',
  info:    'bg-blue-900/40 text-blue-400 border-blue-700/50',
  muted:   'bg-slate-800/60 text-slate-400 border-slate-600/50',
};

const estadoToVariant = {
  APROBADO:  'success',
  ACTIVO:    'success',
  PENDIENTE: 'warning',
  INACTIVO:  'muted',
  DELEGADO:  'info',
  ORGANIZADOR: 'info',
};

const Badge = ({ children, variant = 'muted', estado, className = '' }) => {
  const resolvedVariant = estado
    ? (estadoToVariant[estado?.toUpperCase()] ?? 'muted')
    : variant;

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${variantClasses[resolvedVariant]} ${className}`}
    >
      {children ?? estado}
    </span>
  );
};

export default Badge;
