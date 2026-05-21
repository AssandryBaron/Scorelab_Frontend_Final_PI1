import React from 'react';
import Button from '../../atoms/Button/Button';

/**
 * Organismo: AppHeader
 * Cabecera del dashboard con título, subtítulo y acciones.
 * 
 * Props:
 *   title: string
 *   subtitle: string
 *   actions: ReactNode (botones adicionales)
 *   onLogout: () => void
 *   onBack: () => void  (opcional, muestra botón de volver)
 */
const AppHeader = ({ title, subtitle, actions, onLogout, onBack }) => {
  return (
    <header className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="muted" size="sm" onClick={onBack}>
            ⬅ Volver
          </Button>
        )}
        {actions}
        {onLogout && (
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Cerrar sesión
          </Button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
