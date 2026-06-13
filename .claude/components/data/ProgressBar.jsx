import React from 'react';

/**
 * ProgressBar — barra de distribuição/carga. Trilho de papel afundado
 * e preenchimento com hachura de buril (textura xilogravura).
 */
export function ProgressBar({ value = 0, tone = 'barro', target = null, height = 14, style = {}, ...props }) {
  const tones = { barro: 'var(--barro)', verde: 'var(--verde)', indigo: 'var(--indigo)', ocre: 'var(--ocre)' };
  const fill = tones[tone] || tones.barro;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      style={{
        position: 'relative', height, width: '100%',
        border: '1.5px solid var(--border-strong)', borderRadius: 'var(--radius-full)',
        background: 'var(--surface-sunk)', overflow: 'hidden', ...style,
      }}
      role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
      {...props}
    >
      <div style={{
        height: '100%', width: `${pct}%`, background: fill,
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.16) 0 2px, transparent 2px 8px)',
        borderRadius: 'var(--radius-full)',
        transition: 'width var(--dur-slow) var(--ease-out)',
      }} />
      {target != null && (
        <div style={{
          position: 'absolute', top: -2, bottom: -2, left: `${Math.max(0, Math.min(100, target))}%`,
          width: 2, background: 'var(--tinta)', opacity: 0.5,
        }} title={`Alvo ${target}%`} />
      )}
    </div>
  );
}
