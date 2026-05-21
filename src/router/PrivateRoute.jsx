import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * PrivateRoute
 * Protege rutas que requieren autenticación.
 * Opcionalmente valida el rol del usuario.
 *
 * Uso:
 *   <Route path="/dashboard-organizador" element={
 *     <PrivateRoute allowedRoles={['ORGANIZADOR']}>
 *       <DashboardOrganizadorPage />
 *     </PrivateRoute>
 *   } />
 */
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, rol } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
