import React from 'react';

/**
 * Select — lista suspensa no mesmo estilo do Input, com seta de cordel.
 */
export function Select({ label, error, id, options = [], style = {}, ...props }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {label && (
        <label htmlFor={id} style={{
          fontWeight: 700, fontSize: 13, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--text-body)',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          id={id}
          onFocus={(e) => { setFocus(true); props.onFocus && props.onFocus(e); }}
          onBlur={(e) => { setFocus(false); props.onBlur && props.onBlur(e); }}
          style={{
            fontFamily: 'var(--font-sans)', fontSize: 15,
            padding: '11px 38px 11px 14px', width: '100%', appearance: 'none',
            background: 'var(--surface-card)', color: 'var(--text-strong)',
            border: `1.5px solid ${error ? 'var(--alerta)' : (focus ? 'var(--barro)' : 'var(--border-mark)')}`,
            borderRadius: 'var(--radius-sm)', outline: 'none', cursor: 'pointer',
            boxShadow: focus ? '0 0 0 4px rgba(177,74,40,0.14)' : 'none',
            transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
            ...style,
          }}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', color: 'var(--text-muted)', fontSize: 12,
        }}>▼</span>
      </div>
    </div>
  );
}
