import React from 'react';

/**
 * Input — campo de texto com rótulo de carimbo. Foco em terracota
 * com anel macio. Cantos arredondados, superfície de papel.
 */
export function Input({ label, error, hint, id, style = {}, ...props }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {label && (
        <label htmlFor={id} style={{
          fontWeight: 700, fontSize: 13, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--text-body)',
        }}>{label}</label>
      )}
      <input
        id={id}
        onFocus={(e) => { setFocus(true); props.onFocus && props.onFocus(e); }}
        onBlur={(e) => { setFocus(false); props.onBlur && props.onBlur(e); }}
        style={{
          fontFamily: 'var(--font-sans)', fontSize: 15,
          padding: '11px 14px', width: '100%',
          background: 'var(--surface-card)', color: 'var(--text-strong)',
          border: `1.5px solid ${error ? 'var(--alerta)' : (focus ? 'var(--barro)' : 'var(--border-mark)')}`,
          borderRadius: 'var(--radius-sm)', outline: 'none',
          boxShadow: focus ? `0 0 0 4px ${error ? 'rgba(200,32,20,0.14)' : 'rgba(177,74,40,0.14)'}` : 'none',
          transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
          ...style,
        }}
        {...props}
      />
      {error
        ? <span style={{ fontSize: 12.5, color: 'var(--alerta)', fontWeight: 600 }}>{error}</span>
        : hint ? <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{hint}</span> : null}
    </div>
  );
}
