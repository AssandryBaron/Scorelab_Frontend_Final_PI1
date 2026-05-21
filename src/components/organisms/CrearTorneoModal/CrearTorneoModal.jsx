import React, { useState } from 'react';
import api from '../../../api/api';
import FormField from '../../molecules/FormField/FormField';
import DateRangeField from '../../molecules/DateRangeField/DateRangeField';
import Textarea from '../../atoms/Textarea/Textarea';
import Button from '../../atoms/Button/Button';

/**
 * Organismo: CrearTorneoModal
 * Modal con formulario para crear un nuevo torneo.
 *
 * Props:
 *   onClose: () => void
 *   onSuccess: () => void   (callback para recargar lista tras crear)
 */
const CrearTorneoModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await api.post('/torneos', form);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear el torneo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">🏆 Crear Torneo</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/40 text-red-400 text-sm px-4 py-3 rounded-lg">
              ⚠ {error}
            </div>
          )}

          <FormField
            label="Nombre del torneo"
            type="text"
            placeholder="Ej. Copa Apertura 2025"
            value={form.nombre}
            onChange={handleChange('nombre')}
            required
          />

          <FormField label="Descripción">
            <Textarea
              placeholder="Describe el torneo brevemente..."
              value={form.descripcion}
              onChange={handleChange('descripcion')}
              rows={3}
            />
          </FormField>

          <DateRangeField
            valueStart={form.fechaInicio}
            valueEnd={form.fechaFin}
            onChangeStart={handleChange('fechaInicio')}
            onChangeEnd={handleChange('fechaFin')}
            required
          />

          <div className="flex gap-3 pt-2">
            <Button variant="muted" fullWidth onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button variant="success" fullWidth type="submit" disabled={cargando}>
              {cargando ? 'Creando...' : 'Crear Torneo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearTorneoModal;
