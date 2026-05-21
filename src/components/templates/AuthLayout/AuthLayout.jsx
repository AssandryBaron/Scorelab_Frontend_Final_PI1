import React from 'react';
import BrandHeader from '../../molecules/BrandHeader/BrandHeader';

/**
 * Template: AuthLayout
 * Layout centrado para las páginas de autenticación (Login y Register).
 * Incluye el BrandHeader y envuelve el contenido en un card.
 */
const AuthLayout = ({ children, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-green-500/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <BrandHeader subtitle={subtitle} />

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {children}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © {new Date().getFullYear()} SCORELAB · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
