import api from '../api/api';

export const torneoService = {
  
  /**
   * Obtiene los torneos del organizador autenticado.
   * Mapea con: GET /api/torneos/mis-torneos
   */
  getMisTorneos: async () => {
    try {
      const response = await api.get('/torneos/mis-torneos');
      
      // EXPLICACIÓN DEL MAPEO:
      // response.data -> es lo que devuelve Axios (el cuerpo de la respuesta HTTP).
      // response.data.data -> es el campo "data" de tu objeto ApiResponse de Java.
      // Aquí es donde Spring Boot puso la lista List<TorneoResponse>.
      
      return response.data?.datos || []; 
    } catch (error) {
      console.error("Error al obtener mis torneos:", error);
      throw error; // Lanzamos el error para que el Hook pueda capturarlo
    }
  },

  /**
   * Crea un nuevo torneo.
   * Mapea con: POST /api/torneos
   */
  crearTorneo: async (torneoData) => {
    try {
      const response = await api.post('/torneos', torneoData);
      return response.data.data; // Retorna el TorneoResponse creado
    } catch (error) {
      console.error("Error al crear el torneo:", error);
      throw error;
    }
  },

  /**
   * Obtiene todos los torneos disponibles (para delegados).
   * Mapea con: GET /api/torneos/todos
   */
  getTodosLosTorneos: async () => {
    try {
      const response = await api.get('/torneos/todos');
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener todos los torneos:", error);
      throw error;
    }
  }
};