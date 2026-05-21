import React from 'react';
import Badge from '../../atoms/Badge/Badge';
import Button from '../../atoms/Button/Button';

/**
 * Molécula: TeamCard
 * Muestra la información de un equipo en formato card.
 * 
 * Props:
 *   equipo: { id, nombre, estado, nombreTorneo }
 *   onGestionarJugadores: (equipo) => void
 */
const TeamCard = ({ equipo, onGestionarJugadores }) => {
  const { nombre, estado, nombreTorneo } = equipo;
  const isAprobado = estado === 'APROBADO';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 hover:border-slate-600 transition-colors duration-200">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-slate-100 font-bold text-base leading-tight">{nombre}</h3>
        <Badge estado={estado ?? 'PENDIENTE'} />
      </div>

      <p className="text-slate-500 text-sm">
        🏆 Torneo: <span className="text-slate-300">{nombreTorneo || 'Sin asignar'}</span>
      </p>

      <hr className="border-slate-800" />

      <Button
        variant={isAprobado ? 'outline' : 'muted'}
        disabled={!isAprobado}
        fullWidth
        onClick={() => isAprobado && onGestionarJugadores(equipo)}
      >
        {isAprobado ? '👥 Gestionar Jugadores' : '🔒 Pendiente de aprobación'}
      </Button>
    </div>
  );
};

export default TeamCard;
