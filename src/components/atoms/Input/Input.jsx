import React from 'react';

/**
 * Átomo: Input
 * Soporta todos los tipos de input HTML estándar.
 * El manejo del label y mensaje de error se hace en la molécula FormField.
 */
const Input = React.forwardRef(
  (
    {
      type = 'text',
      placeholder = '',
      value,
      onChange,
      required = false,
      disabled = false,
      hasError = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const base =
      'w-full px-3 py-2.5 rounded-md text-sm text-white placeholder-slate-500 bg-slate-950 border transition-colors duration-150 outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-40 disabled:cursor-not-allowed';

    const borderClass = hasError
      ? 'border-red-500 focus:border-red-400 focus:ring-red-500/30'
      : 'border-slate-700 hover:border-slate-500 focus:border-blue-500 focus:ring-blue-500/20';

    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${base} ${borderClass} ${className}`}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
