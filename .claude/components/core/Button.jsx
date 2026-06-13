import React from 'react';

/**
 * Button — ação primária do Casa Comigo.
 * Terracota (barro) para ação principal; cantos macios, sombra quente
 * que descola o botão do papel, leve elevação no hover.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  disabled,
  ...props
}) {
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13.5, gap: 6, radius: 'var(--radius-sm)' },
    md: { padding: '11px 20px', fontSize: 15, gap: 8, radius: 'var(--radius-md)' },
    lg: { padding: '14px 26px', fontSize: 16.5, gap: 9, radius: 'var(--radius-md)' },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: 'var(--action)', color: 'var(--text-on-barro)',
      border: '1.5px solid var(--barro-fundo)', boxShadow: 'var(--shadow-barro)',
    },
    secondary: {
      background: 'var(--surface-sand)', color: 'var(--text-strong)',
      border: '1.5px solid var(--border-mark)', boxShadow: 'var(--shadow-md)',
    },
    ink: {
      background: 'var(--tinta)', color: 'var(--text-on-ink)',
      border: '1.5px solid var(--tinta)', boxShadow: 'var(--shadow-ink)',
    },
    ghost: {
      background: 'transparent', color: 'var(--text-strong)',
      border: '1.5px solid transparent', boxShadow: 'none',
    },
    danger: {
      background: 'transparent', color: 'var(--vermelho)',
      border: '1.5px solid var(--vermelho)', boxShadow: 'none',
    },
  };
  const v = variants[variant] || variants.primary;
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      style={{
        fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: s.fontSize,
        letterSpacing: '0.01em', lineHeight: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
        padding: s.padding, borderRadius: s.radius,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.55 : 1,
        transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
        whiteSpace: 'nowrap', ...v, ...style,
      }}
      onMouseEnter={(e) => { if (isDisabled) return; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; if (variant === 'primary') e.currentTarget.style.background = 'var(--action-press)'; if (variant === 'secondary') e.currentTarget.style.background = 'var(--areia-fundo)'; if (variant === 'ghost') e.currentTarget.style.background = 'var(--surface-sunk)'; if (variant === 'danger') e.currentTarget.style.background = 'var(--vermelho-claro)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = v.background; e.currentTarget.style.boxShadow = v.boxShadow; }}
      onMouseDown={(e) => { if (!isDisabled) e.currentTarget.style.transform = 'translateY(0) scale(0.98)'; }}
      onMouseUp={(e) => { if (!isDisabled) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      {...props}
    >
      {loading ? (
        <span style={{
          width: '1em', height: '1em', borderRadius: '50%',
          border: '2px solid currentColor', borderTopColor: 'transparent',
          display: 'inline-block', animation: 'cc-spin 0.7s linear infinite',
        }} />
      ) : iconLeft}
      {children}
      {iconRight}
      <style>{`@keyframes cc-spin{to{transform:rotate(360deg)}}`}</style>
    </button>
  );
}
