import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
}) {
  const baseClasses =
    'font-semibold rounded-xl transition shadow-md';

  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary:
      'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-2 border-indigo-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-2 text-lg w-full',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}