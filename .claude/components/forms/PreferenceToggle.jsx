import React from 'react';
import { Icon } from '../icons/Icon.jsx';

const OPTS = [
  { value: 'hate',    icon: 'sad',     label: 'Não gosto', on: 'var(--vermelho-claro)', bd: 'var(--vermelho)' },
  { value: 'neutral', icon: 'neutral', label: 'Neutro',    on: 'var(--ocre-claro)',     bd: 'var(--ocre)' },
  { value: 'like',    icon: 'happy',   label: 'Gosto',     on: 'var(--verde-claro)',    bd: 'var(--verde)' },
];

/**
 * PreferenceToggle — segmento de preferência (não gosto / neutro / gosto)
 * com faces xilográficas. Coração do Casa Comigo: cada morador marca
 * sua afinidade com a tarefa.
 */
export function PreferenceToggle({ value = 'neutral', onChange, showLabels = false, style = {}, ...props }) {
  return (
    <div role="group" aria-label="preferência" style={{
      display: 'inline-flex', border: '1.5px solid var(--border-mark)',
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
      background: 'var(--surface-card)', boxShadow: 'var(--shadow-md)', ...style,
    }} {...props}>
      {OPTS.map((o, i) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange && onChange(o.value)}
            title={o.label}
            style={{
              border: 'none', cursor: 'pointer', lineHeight: 0, whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
              padding: showLabels ? '9px 15px' : '9px 14px',
              background: active ? o.on : 'transparent',
              color: active ? 'var(--text-strong)' : 'var(--text-muted)',
              borderRight: i < OPTS.length - 1 ? '1.5px solid var(--border)' : 'none',
              transition: 'background var(--dur-base) var(--ease-out)',
            }}
          >
            <Icon name={o.icon} size={24} color={active ? o.bd : 'var(--text-muted)'} paper="var(--papel-branco)" />
            {showLabels && <span style={{ lineHeight: 1.2 }}>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
