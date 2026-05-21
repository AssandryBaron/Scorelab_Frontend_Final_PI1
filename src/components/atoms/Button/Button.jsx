import React from 'react';

/**
 * Átomo: Button
 * Variantes: primary | danger | ghost | outline | success | muted
 * Tamaños: sm | md | lg
 */
const variantClasses = {
  primary:  'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
  success:  'bg-green-700 hover:bg-green-800 text-white border-transparent',
  danger:   'bg-red-700 hover:bg-red-800 text-white border-transparent',
  ghost:    'bg-transparent hover:bg-white/5 text-red-400 border-red-500 hover:border-red-400',
  outline:  'bg-transparent hover:bg-white/5 text-blue-400 border-blue-500 hover:border-blue-400',
  muted:    'bg-transparent hover:bg-white/5 text-slate-400 border-slate-600 hover:border-slate-500',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold border rounded-md cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed';

  const classes = [
    base,
    variantClasses[variant] ?? variantClasses.primary,
    sizeClasses[size] ?? sizeClasses.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
};

export default Button;
