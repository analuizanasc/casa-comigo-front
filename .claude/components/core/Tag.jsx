import React from 'react';

/**
 * Tag (papel-pill) — chip de metadado discreto: duração, frequência,
 * cômodo, morador. Fundo de papel afundado, sem caixa-alta.
 */
export function Tag({ icon = null, children, style = {}, ...props }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12.5, fontWeight: 600,
        padding: '4px 11px', borderRadius: 'var(--radius-full)',
        background: 'var(--surface-sunk)', color: 'var(--text-body)',
        whiteSpace: 'nowrap', lineHeight: 1.4, ...style,
      }}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex', opacity: 0.8 }}>{icon}</span>}
      {children}
    </span>
  );
}
