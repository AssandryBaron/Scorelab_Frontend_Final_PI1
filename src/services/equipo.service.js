import api from '../api/api';

export const equipoService = {
  // Obtener los equipos que pertenecen al delegado logueado
  getMisEquipos: async () => {
    try {
      const response = await api.get('/equipos/mis-equipos');
      return response.data?.datos || []; 
    } catch (error) {
      console.error("Error al obtener mis equipos:", error);
      throw error;
    }
  },

  // Función para que el delegado cree un nuevo equipo
  crearEquipo: async (equipoData) => {
    try {
      const response = await api.post('/equipos', equipoData);
      return response.data;
    } catch (error) {
      console.error("Error al crear equipo:", error);
      throw error;
    }
  }
};