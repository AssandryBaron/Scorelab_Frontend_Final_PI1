import React from 'react';
import FormField from '../FormField/FormField';

/**
 * Molécula: DateRangeField
 * Agrupa dos campos de fecha (inicio y fin) en una fila.
 * 
 * Uso:
 *   <DateRangeField
 *     valueStart={fechaInicio}
 *     valueEnd={fechaFin}
 *     onChangeStart={(e) => setFechaInicio(e.target.value)}
 *     onChangeEnd={(e) => setFechaFin(e.target.value)}
 *   />
 */
const DateRangeField = ({
  valueStart,
  valueEnd,
  onChangeStart,
  onChangeEnd,
  labelStart = 'Fecha de Inicio',
  labelEnd = 'Fecha de Fin',
  required = false,
  errorStart,
  errorEnd,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        label={labelStart}
        type="date"
        value={valueStart}
        onChange={onChangeStart}
        required={required}
        error={errorStart}
      />
      <FormField
        label={labelEnd}
        type="date"
        value={valueEnd}
        onChange={onChangeEnd}
        required={required}
        error={errorEnd}
      />
    </div>
  );
};

export default DateRangeField;
