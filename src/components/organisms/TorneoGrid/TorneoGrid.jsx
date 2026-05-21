import React from "react";
import TorneoCard from "../../molecules/TorneoCard/TorneoCard";
import EmptyState from "../../atoms/EmptyState/EmptyState";
import Spinner from "../../atoms/Spinner/Spinner";

/**
 * Organismo: TorneoGrid
 * Renderiza la lista de torneos.
 * He añadido validaciones extra para evitar que el componente falle si faltan datos.
 */
const TorneoGrid = ({ torneos = [], loading = false }) => {
  // 1. Estado de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full text-center">
        <Spinner />
        <p className="text-slate-400 mt-4 animate-pulse">
          Consultando torneos en ScoreLab...
        </p>
      </div>
    );
  }

  // 2. Estado vacío (Validación robusta para arrays)
  if (!Array.isArray(torneos) || torneos.length === 0) {
    return (
      <div className="w-full py-10">
        <EmptyState
          icon="🏆"
          message="No hay torneos registrados aún. ¡Crea el primero!"
        />
      </div>
    );
  }

  // 3. Renderizado de la lista
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {torneos.map((torneo) => {
        // Validación interna: Si por algún motivo el objeto torneo viene mal, no rompemos el render
        if (!torneo) return null;

        return (
          <TorneoCard
            key={torneo.id}
            // Sincronización exacta con tu JSON de Spring Boot:
            title={torneo.nombre || "Torneo sin nombre"}
            description={torneo.descripcion || "Sin descripción disponible"}
            date={`${torneo.fechaInicio} / ${torneo.fechaFin}`}
            status={torneo.estado}
            teamsCount={torneo.cantidadEquipos || 0}
            // Opcional: pasar el objeto completo por si el hijo lo necesita
            torneo={torneo}
          />
        );
      })}
    </div>
  );
};

export default TorneoGrid;
