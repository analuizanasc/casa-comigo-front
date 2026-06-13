/* Casa Comigo · UI kit — shell, sidebar, topbar, Lucide icon helper.
   Exports to window for the other babel scripts. */

const { useState, useRef, useEffect } = React;
const { Avatar, Icon } = window.CasaComigoDesignSystem_64c258;

/* ---- mock data ---- */
const HOUSE = { name: 'Apto 404', code: 'CMG404' };

const MEMBERS = [
  { id: 'qa', name: 'qa', email: 'qa@casacomigo.app', role: 'admin', tone: 'barro', load: 10 },
  { id: 'marcelo', name: 'Marcelo', email: 'marcelo@casacomigo.app', role: 'resident', tone: 'indigo', load: 10 },
];

const NAV = [
  { key: 'schedule',    label: 'Cronograma',   icon: 'calendar' },
  { key: 'catalog',     label: 'Catálogo',     icon: 'clipboard' },
  { key: 'preferences', label: 'Preferências', icon: 'heart' },
  { key: 'members',     label: 'Membros',      icon: 'users' },
  { key: 'reports',     label: 'Relatórios',   icon: 'chart' },
];

/* ---- Sidebar ---- */
function Sidebar({ active, onNavigate, onLeave }) {
  return (
    <aside style={{
      width: 256, flex: 'none', background: 'var(--surface-soft)',
      border: '1.5px solid var(--border-mark)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column',
      padding: '22px 16px', position: 'sticky', top: 20, margin: '20px 0 20px 20px',
      height: 'calc(100vh - 40px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 6px 20px' }}>
        <span className="cc-sol" style={{ width: 38, height: 38, flex: 'none' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 16, lineHeight: 1.05, whiteSpace: 'nowrap' }}>Casa Comigo</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{HOUSE.name}</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
        {NAV.map((item) => {
          const on = active === item.key;
          return (
            <button key={item.key} onClick={() => onNavigate(item.key)} style={{
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
              padding: '11px 13px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontWeight: on ? 700 : 600, fontSize: 15.5,
              color: on ? 'var(--barro-fundo)' : 'var(--text-body)',
              background: on ? 'var(--barro-claro)' : 'transparent',
              border: on ? '1px solid rgba(177,74,40,0.35)' : '1px solid transparent',
              transition: 'background var(--dur-base) var(--ease-out)',
            }}
            onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--surface-sunk)'; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
              <Icon name={item.icon} size={23} paper={on ? 'var(--barro-claro)' : 'var(--surface-soft)'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button onClick={onLeave} style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600, fontSize: 13,
          fontFamily: 'var(--font-sans)', padding: '6px 8px',
        }}>
          <Icon name="arrowleft" size={16} /> Trocar de casa
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8 }}>
          <Avatar name="qa" tone="barro" size={34} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>qa</div>
          </div>
          <button title="Sair" style={{
            display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--barro)', fontWeight: 700, fontSize: 13,
            fontFamily: 'var(--font-sans)', padding: '4px 6px',
          }}>
            <Icon name="x" size={15} color="var(--barro)" /> Sair
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ---- Page header ---- */
function PageHeader({ eyebrow, title, meta, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 28 }}>
      <div style={{ minWidth: 0 }}>
        <div className="cc-eyebrow">{eyebrow}</div>
        <h1 className="cc-display" style={{ fontSize: 'var(--display-md)', marginTop: 6 }}>{title}</h1>
        {meta && <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--text-muted)' }}>{meta}</p>}
      </div>
      {action}
    </div>
  );
}

Object.assign(window, { Icon, Sidebar, PageHeader, HOUSE, MEMBERS, NAV });
