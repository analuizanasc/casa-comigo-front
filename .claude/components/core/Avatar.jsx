import React from 'react';

/**
 * Avatar — carimbo de inicial. Tipografia de cartaz (Anton), borda
 * macia e fundo de barro/anil. Use para moradores da casa.
 */
export function Avatar({ name = '?', tone = 'barro', size = 42, src = null, style = {}, ...props }) {
  const tones = {
    barro:  { background: 'var(--barro-claro)',  color: 'var(--barro-fundo)' },
    indigo: { background: 'var(--indigo-claro)',  color: 'var(--indigo)' },
    verde:  { background: 'var(--verde-claro)',   color: '#3d5026' },
    ocre:   { background: 'var(--ocre-claro)',    color: '#855415' },
  };
  const t = tones[tone] || tones.barro;
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <span
      style={{
        width: size, height: size, flex: 'none',
        display: 'inline-grid', placeItems: 'center', overflow: 'hidden',
        borderRadius: '50%', border: '1.5px solid var(--border-strong)',
        fontFamily: 'var(--font-display)', fontSize: size * 0.42,
        textTransform: 'uppercase', lineHeight: 1, ...t, ...style,
      }}
      {...props}
    >
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
    </span>
  );
}
