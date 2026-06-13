import React from 'react';

/**
 * ProgressRing — anel de conclusão do morador no período. Disco de
 * tinta sobre papel com número de cartaz (Anton) no centro.
 */
export function ProgressRing({ value = 0, size = 64, tone = 'barro', style = {}, ...props }) {
  const tones = { barro: 'var(--barro)', verde: 'var(--verde)', indigo: 'var(--indigo)', ocre: 'var(--ocre)' };
  const fill = tones[tone] || tones.barro;
  const pct = Math.max(0, Math.min(100, value));
  const inner = size * 0.72;
  return (
    <div
      style={{
        width: size, height: size, flex: 'none', borderRadius: '50%',
        display: 'grid', placeItems: 'center',
        border: '1.5px solid var(--border-strong)',
        background: `conic-gradient(${fill} ${pct}%, var(--surface-sunk) 0)`,
        ...style,
      }}
      role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
      {...props}
    >
      <div style={{
        width: inner, height: inner, borderRadius: '50%',
        background: 'var(--surface-card)', display: 'grid', placeItems: 'center',
        border: '1px solid var(--border)',
        fontFamily: 'var(--font-display)', fontSize: size * 0.26, color: 'var(--text-strong)',
      }}>{Math.round(pct)}%</div>
    </div>
  );
}
