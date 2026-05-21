import React from "react";
import api from "../../../api/api";
import Badge from "../../atoms/Badge/Badge";
import Button from "../../atoms/Button/Button";
import EmptyState from "../../atoms/EmptyState/EmptyState";
import Spinner from "../../atoms/Spinner/Spinner";

/**
 * Organismo: SolicitudesTable
 * Tabla de equipos que han solicitado inscripción a torneos.
 */
const SolicitudesTable = ({
  solicitudes = [],
  cargando = false,
  onRefresh,
}) => {
  const handleDecision = async (equipoId, decision) => {
    try {
      // 🌟 CORRECCIÓN: Sincronización con el Backend
      // Tu controlador usa PATCH /api/equipos/{id}/aprobar
      if (decision === "APROBADO") {
        await api.patch(`/equipos/${equipoId}/aprobar`);
      } else {
        // Si aún no tienes el endpoint de rechazar, puedes usar uno genérico
        // o simplemente imprimir en consola por ahora
        await api.patch(`/equipos/${equipoId}/estado`, { estado: "RECHAZADO" });
      }

      // Refrescamos la lista después de la acción exitosa
      onRefresh?.();
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("No se pudo procesar la solicitud.");
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center py-12">
        <Spinner text="Cargando solicitudes..." />
      </div>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <EmptyState
        icon="📋"
        message="No hay solicitudes de inscripción pendientes."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left">Equipo</th>
            <th className="px-4 py-3 text-left">Torneo</th>
            <th className="px-4 py-3 text-left">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((equipo) => (
            <tr
              key={equipo.id}
              className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-4 py-3 text-slate-200 font-medium">
                {equipo.nombre}
              </td>
              {/* 🌟 CORRECCIÓN: Verifica que el campo sea 'torneoNombre' o 'nombreTorneo' según tu EquipoResponse en Java */}
              <td className="px-4 py-3 text-slate-400">
                {equipo.torneoNombre || equipo.nombreTorneo || "—"}
              </td>
              <td className="px-4 py-3">
                <Badge estado={equipo.estado ?? "PENDIENTE"} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {equipo.estado === "PENDIENTE" && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleDecision(equipo.id, "APROBADO")}
                      >
                        ✓ Aprobar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDecision(equipo.id, "RECHAZADO")}
                      >
                        ✕ Rechazar
                      </Button>
                    </>
                  )}
                  {equipo.estado !== "PENDIENTE" && (
                    <span className="text-slate-600 text-xs italic">
                      Procesado
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SolicitudesTable;
