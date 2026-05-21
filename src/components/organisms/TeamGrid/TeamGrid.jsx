import React from 'react';
import TeamCard from '../../molecules/TeamCard/TeamCard';
import EmptyState from '../../atoms/EmptyState/EmptyState';
import Spinner from '../../atoms/Spinner/Spinner';

/**
 * Organismo: TeamGrid
 * Renderiza la grilla de equipos del delegado.
 *
 * Props:
 *   equipos: array
 *   cargando: boolean
 *   onGestionarJugadores: (equipo) => void
 */
const TeamGrid = ({ equipos = [], cargando = false, onGestionarJugadores }) => {
  if (cargando) {
    return (
      <div className="flex justify-center py-16">
        <Spinner text="Cargando equipos..." />
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <EmptyState
        icon="👥"
        message="No tienes equipos registrados aún. ¡Inscribe el primero!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipos.map((equipo) => (
        <TeamCard
          key={equipo.id}
          equipo={equipo}
          onGestionarJugadores={onGestionarJugadores}
        />
      ))}
    </div>
  );
};

export default TeamGrid;
