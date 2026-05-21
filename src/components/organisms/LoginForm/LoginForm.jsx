import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react"; // ✨ Importamos icono para el acceso público
import api from "../../../api/api";
import FormField from "../../molecules/FormField/FormField";
import Button from "../../atoms/Button/Button";

const LoginForm = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      // 1. Petición al backend
      const response = await api.post("/auth/login", { correo, contrasena });

      // 📝 LOG CRÍTICO: Mira la consola del navegador (F12) al presionar el botón
      console.log("RESPUESTA RECIBIDA:", response.data);

      // 2. Intentar extraer datos (buscamos en .datos o directamente en el objeto)
      const data = response.data.datos || response.data;

      if (data && data.token) {
        // 🌟 GUARDADO MANUAL FORZADO
        localStorage.setItem("token", data.token);

        // Si el rol viene en 'usuario.rol' o directo en 'rol'
        const finalRol = data.rol || data.usuario?.rol || "DELEGADO";
        const finalNombre = data.nombre || data.usuario?.nombre || "Usuario";

        localStorage.setItem("rol", finalRol);
        localStorage.setItem("nombre", finalNombre);

        // Creamos el objeto user que esperan las demás páginas
        const userObj = { nombre: finalNombre, rol: finalRol };
        localStorage.setItem("user", JSON.stringify(userObj));

        console.log("✅ LOCALSTORAGE ACTUALIZADO CORRECTAMENTE");

        // 3. Redirección inmediata
        if (finalRol === "ORGANIZADOR") {
          navigate("/dashboard-organizador");
        } else {
          navigate("/dashboard-delegado");
        }
      } else {
        console.error("❌ ESTRUCTURA DE DATOS DESCONOCIDA:", data);
        setError("Error en el formato de respuesta del servidor.");
      }
    } catch (err) {
      console.error("❌ ERROR EN PETICIÓN:", err);
      const msg =
        err.response?.data?.mensaje || "Error al conectar con el servidor.";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-white">Iniciar sesión</h2>
        <p className="text-slate-500 text-sm mt-1">
          Ingresa con tu cuenta registrada
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/40 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <FormField
        label="Correo electrónico"
        type="email"
        placeholder="tu@correo.com"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />

      <FormField
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />

      <Button type="submit" variant="success" fullWidth disabled={cargando}>
        {cargando ? "Verificando..." : "Ingresar →"}
      </Button>

      {/* Enlace de Registro Tradicional */}
      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <span
          className="text-green-400 cursor-pointer hover:underline font-medium"
          onClick={() => navigate("/register")}
        >
          Crear cuenta nueva →
        </span>
      </p>

      {/* ── Separador Línea Divisoria ── */}
      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-slate-800"></div>
        <span className="flex-shrink mx-4 text-slate-600 text-xs font-bold uppercase tracking-wider">
          O
        </span>
        <div className="flex-grow border-t border-slate-800"></div>
      </div>

      {/* ✨ BOTÓN ACCESO PÚBLICO ESPECTADOR */}
      <button
        type="button"
        onClick={() => navigate("/espectador")}
        className="flex items-center justify-center gap-2 w-full bg-slate-900 border border-slate-800 
          hover:border-slate-700 hover:bg-slate-800/80 text-slate-300 text-sm font-bold py-2.5 px-4 
          rounded-xl transition-all duration-200 active:scale-[0.98]"
      >
        <Globe size={15} className="text-green-400" />
        Ingresar como Espectador Público
      </button>
    </form>
  );
};

export default LoginForm;
