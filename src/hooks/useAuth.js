/**
 * Hook: useAuth
 * Centraliza la lectura/escritura de datos de sesión en localStorage.
 */
export const useAuth = () => {
  const token  = localStorage.getItem('token');
  const rol    = localStorage.getItem('rol');
  const nombre = localStorage.getItem('nombre');

  const isAuthenticated = Boolean(token);

  const logout = () => localStorage.clear();

  return { token, rol, nombre, isAuthenticated, logout };
};
