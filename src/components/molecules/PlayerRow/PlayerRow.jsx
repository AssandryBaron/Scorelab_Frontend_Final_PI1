import React from 'react';
import Badge from '../../atoms/Badge/Badge';

/**
 * Molécula: PlayerRow
 * Fila de jugador existente en la tabla de plantilla.
 * Para las filas editables (nuevos jugadores) se usa directamente en PlayerRoster.
 */
const PlayerRow = ({ jugador }) => {
  const { nombre, documento, posicion, numeroCamiseta } = jugador;

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
      <td className="px-4 py-3 text-slate-200 text-sm">{nombre}</td>
      <td className="px-4 py-3 text-slate-400 text-sm">{documento}</td>
      <td className="px-4 py-3">
        <Badge variant="info">{posicion || 'N/A'}</Badge>
      </td>
      <td className="px-4 py-3 text-yellow-400 font-bold text-sm">
        #{numeroCamiseta}
      </td>
    </tr>
  );
};

export default PlayerRow;
