import React from 'react';
import Badge from '../../atoms/Badge/Badge';

/**
 * Molécula: TorneoCard
 * Muestra la información de un torneo en formato card.
 * 
 * Props:
 *   torneo: { id, nombre, descripcion, fechaInicio, fechaFin, cantidadEquipos, estado }
 */
const TorneoCard = ({ torneo }) => {
  const { nombre, descripcion, fechaInicio, fechaFin, cantidadEquipos = 0, estado } = torneo;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4 hover:border-slate-600 transition-colors duration-200">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-yellow-400 font-bold text-lg leading-tight">{nombre}</h3>
        {estado && <Badge estado={estado} />}
      </div>

      {descripcion && (
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
          {descripcion}
        </p>
      )}

      <hr className="border-slate-800" />

      <div className="flex justify-between text-xs text-slate-400">
        <span>📅 <strong className="text-slate-300">Inicio:</strong> {fechaInicio || '—'}</span>
        <span>🏁 <strong className="text-slate-300">Fin:</strong> {fechaFin || '—'}</span>
      </div>

      <Badge variant="success" className="self-start">
        {cantidadEquipos} {cantidadEquipos === 1 ? 'equipo inscrito' : 'equipos inscritos'}
      </Badge>
    </div>
  );
};

export default TorneoCard;
