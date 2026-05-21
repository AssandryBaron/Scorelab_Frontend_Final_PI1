import { useState, useEffect, useCallback } from 'react';
import { torneoService } from '../services/torneo.service';

export const useTorneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTorneos = useCallback(async () => {
    try {
      setLoading(true);
      const listaTorneos = await torneoService.getMisTorneos();
      console.log("Torneos cargados en el Hook:", listaTorneos);
      setTorneos(listaTorneos || []);
    } catch (err) {
      console.error("Error al cargar:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  return { torneos, loading, refresh: fetchTorneos };
};