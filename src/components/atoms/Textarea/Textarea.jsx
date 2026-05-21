import React from 'react';

/**
 * Átomo: Textarea
 */
const Textarea = ({
  placeholder = '',
  value,
  onChange,
  required = false,
  disabled = false,
  hasError = false,
  rows = 3,
  className = '',
  ...rest
}) => {
  const base =
    'w-full px-3 py-2.5 rounded-md text-sm text-white placeholder-slate-500 bg-slate-950 border transition-colors duration-150 outline-none focus:ring-2 focus:ring-offset-0 resize-y disabled:opacity-40 disabled:cursor-not-allowed';

  const borderClass = hasError
    ? 'border-red-500 focus:border-red-400 focus:ring-red-500/30'
    : 'border-slate-700 hover:border-slate-500 focus:border-blue-500 focus:ring-blue-500/20';

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      rows={rows}
      className={`${base} ${borderClass} ${className}`}
      {...rest}
    />
  );
};

export default Textarea;
