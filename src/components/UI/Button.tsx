import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const variantClass: Record<string, string> = {
  primary: 'btn--barro',
  secondary: '',
  ghost: 'btn--ghost',
  danger: 'btn--perigo',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn ${variantClass[variant] ?? ''} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`.trim().replace(/\s+/g, ' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="btn__spinner" /> : null}
      {children}
    </button>
  );
}
