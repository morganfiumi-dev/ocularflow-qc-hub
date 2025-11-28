/**
 * Button Component for OcularFlow v10.5
 */

import React from 'react';

/**
 * Button variants
 */
const variants = {
  primary: 'of-btn-primary',
  secondary: 'of-btn-secondary',
  ghost: 'of-btn-ghost',
  danger: 'of-btn-danger'
};

/**
 * Button sizes
 */
const sizes = {
  sm: 'px-2 py-1 text-[9px]',
  md: 'px-3 py-1.5 text-[10px]',
  lg: 'px-4 py-2 text-xs'
};

/**
 * Button component
 * @param {Object} props
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon = null,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...rest
}) {
  const baseClasses = 'of-btn inline-flex items-center justify-center gap-1.5 font-bold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {Icon && iconPosition === 'left' && !loading && <Icon size={12} />}
      {children}
      {Icon && iconPosition === 'right' && !loading && <Icon size={12} />}
    </button>
  );
}

/**
 * Icon Button - for toolbar buttons
 */
export function IconButton({
  icon: Icon,
  size = 16,
  active = false,
  disabled = false,
  className = '',
  title = '',
  onClick,
  ...rest
}) {
  return (
    <button
      className={`of-transport-btn ${active ? 'primary' : ''} ${className}`}
      disabled={disabled}
      title={title}
      onClick={onClick}
      {...rest}
    >
      <Icon size={size} />
    </button>
  );
}

/**
 * Toggle Button
 */
export function ToggleButton({
  children,
  active = false,
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  return (
    <button
      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
        active 
          ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' 
          : 'border-slate-700 text-slate-500 hover:text-slate-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
