import React from 'react';

/**
 * Card (bloco) — superfície flutuante. Descolada do papel por sombra
 * quente em camadas e cantos macios. `stamp` traz o acento xilogravura
 * (sombra dura de carimbo). `accent` pinta uma faixa lateral de cor.
 */
export function Card({
  surface = 'card',
  elevation = 'md',
  stamp = false,
  accent = null,
  padding = 'var(--space-5)',
  interactive = false,
  style = {},
  children,
  ...props
}) {
  const surfaces = {
    card: 'var(--surface-card)',
    soft: 'var(--surface-soft)',
    sunk: 'var(--surface-sunk)',
  };
  const elevations = {
    none: 'none', sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)',
  };
  const base = {
    background: surfaces[surface] || surfaces.card,
    border: '1.5px solid var(--border-mark)',
    borderRadius: stamp ? 'var(--radius-carimbo)' : 'var(--radius-md)',
    boxShadow: stamp ? 'var(--shadow-carimbo)' : (elevations[elevation] || elevations.md),
    padding,
    transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
    ...(accent ? { borderLeft: `5px solid ${accent}` } : {}),
    ...style,
  };
  return (
    <div
      style={base}
      onMouseEnter={interactive ? (e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; } : undefined}
      onMouseLeave={interactive ? (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = base.boxShadow; } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
