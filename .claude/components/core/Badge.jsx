import React from 'react';

const TONES = {
  default:    { bg: 'var(--surface-card)',   bd: 'var(--border-strong)', fg: 'var(--text-strong)' },
  sage:       { bg: 'var(--verde-claro)',    bd: 'var(--verde)',         fg: '#3d5026' },
  warning:    { bg: 'var(--ocre-claro)',     bd: 'var(--ocre)',          fg: '#855415' },
  danger:     { bg: 'var(--vermelho-claro)', bd: 'var(--vermelho)',      fg: 'var(--vermelho)' },
  info:       { bg: 'var(--indigo-claro)',   bd: 'var(--indigo)',        fg: 'var(--indigo)' },
  success:    { bg: 'var(--verde-claro)',    bd: 'var(--verde)',         fg: '#3d5026' },
  terracotta: { bg: 'var(--barro-claro)',    bd: 'var(--barro)',         fg: 'var(--barro-fundo)' },
};

/**
 * Badge / selo — carimbo de status, esforço ou cargo. Caixa-alta,
 * pílula com borda fina de cor. `dot` adiciona o ponto de status.
 */
export function Badge({ variant = 'default', dot = false, children, style = {}, ...props }) {
  const t = TONES[variant] || TONES.default;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-sans)', fontWeight: 700,
        textTransform: 'uppercase', fontSize: 11.5, letterSpacing: '0.1em',
        padding: dot ? '5px 11px' : '4px 11px',
        border: `1.5px solid ${t.bd}`, borderRadius: 'var(--radius-full)',
        background: t.bg, color: t.fg, lineHeight: 1, whiteSpace: 'nowrap', ...style,
      }}
      {...props}
    >
      {dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', flex: 'none' }} />}
      {children}
    </span>
  );
}

/* Mapas de domínio — herdados do app Casa Comigo.
   Também anexados a Badge.* para que cheguem ao namespace do bundle
   (exports minúsculos ficam internos). */
export const effortLabel = { light: 'Leve', medium: 'Médio', heavy: 'Pesado' };
export const effortVariant = { light: 'sage', medium: 'warning', heavy: 'danger' };
export const statusLabel = { pending: 'Pendente', completed: 'Concluída', overdue: 'Atrasada', redistributed: 'Redistribuída' };
export const statusVariant = { pending: 'info', completed: 'success', overdue: 'danger', redistributed: 'warning' };
export const roleLabel = { admin: 'Administrador', catalog_manager: 'Gestor de Catálogo', resident: 'Morador' };

Badge.effortLabel = effortLabel;
Badge.effortVariant = effortVariant;
Badge.statusLabel = statusLabel;
Badge.statusVariant = statusVariant;
Badge.roleLabel = roleLabel;
