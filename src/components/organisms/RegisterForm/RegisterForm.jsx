import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import FormField from '../../molecules/FormField/FormField';
import Select from '../../atoms/Select/Select';
import Button from '../../atoms/Button/Button';

/**
 * Organismo: RegisterForm
 * Contiene toda la lógica y UI del formulario de registro.
 */
const ROL_OPTIONS = [
  { value: 'ORGANIZADOR', label: 'Organizador' },
  { value: 'DELEGADO', label: 'Delegado' },
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: '',
  });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrores((prev) => ({ ...prev, [field]: '' }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido.';
    if (!form.correo.trim()) nuevosErrores.correo = 'El correo es requerido.';
    if (!form.contrasena || form.contrasena.length < 6)
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
    if (!form.rol) nuevosErrores.rol = 'Debes seleccionar un rol.';
    return nuevosErrores;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const validation = validar();
    if (Object.keys(validation).length > 0) {
      setErrores(validation);
      return;
    }

    setCargando(true);
    try {
      await api.post('/auth/register', form);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al registrarse. Intenta de nuevo.';
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-white">Crear cuenta</h2>
        <p className="text-slate-500 text-sm mt-1">Únete a SCORELAB</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/40 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}

      <FormField
        label="Nombre completo"
        type="text"
        placeholder="Ej. Juan Pérez"
        value={form.nombre}
        onChange={handleChange('nombre')}
        error={errores.nombre}
        required
      />

      <FormField
        label="Correo electrónico"
        type="email"
        placeholder="tu@correo.com"
        value={form.correo}
        onChange={handleChange('correo')}
        error={errores.correo}
        required
      />

      <FormField
        label="Contraseña"
        type="password"
        placeholder="Mínimo 6 caracteres"
        value={form.contrasena}
        onChange={handleChange('contrasena')}
        error={errores.contrasena}
        required
      />

      <FormField label="Rol" error={errores.rol} required>
        <Select
          value={form.rol}
          onChange={handleChange('rol')}
          options={ROL_OPTIONS}
          placeholder="-- Selecciona tu rol --"
          hasError={Boolean(errores.rol)}
        />
      </FormField>

      <Button type="submit" variant="success" fullWidth disabled={cargando}>
        {cargando ? 'Registrando...' : 'Crear cuenta →'}
      </Button>

      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <span
          className="text-green-400 font-semibold cursor-pointer hover:text-green-300 transition-colors"
          onClick={() => navigate('/')}
        >
          Inicia sesión →
        </span>
      </p>
    </form>
  );
};

export default RegisterForm;
