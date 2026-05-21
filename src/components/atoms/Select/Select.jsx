import React from 'react';

/**
 * Átomo: Select
 * Recibe un array de opciones: [{ value, label }]
 */
const Select = ({
  value,
  onChange,
  options = [],
  placeholder = '-- Selecciona una opción --',
  required = false,
  disabled = false,
  hasError = false,
  className = '',
  ...rest
}) => {
  const base =
    'w-full px-3 py-2.5 rounded-md text-sm text-white bg-slate-950 border transition-colors duration-150 outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer appearance-none';

  const borderClass = hasError
    ? 'border-red-500 focus:border-red-400 focus:ring-red-500/30'
    : 'border-slate-700 hover:border-slate-500 focus:border-blue-500 focus:ring-blue-500/20';

  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${base} ${borderClass} ${className}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Flecha personalizada */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default Select;
