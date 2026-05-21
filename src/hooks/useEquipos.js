import { useState, useEffect, useCallback } from 'react';
import { equipoService } from '../services/equipo.service';

export const useEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEquipos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await equipoService.getMisEquipos();
      setEquipos(data);
    } catch (err) {
      setError("No se pudieron cargar tus equipos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipos();
  }, [fetchEquipos]);

  return { equipos, loading, error, refresh: fetchEquipos };
};