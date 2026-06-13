import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHouse } from '../../contexts/HouseContext';

/* Ícones xilográficos inline — traço marcante, estilo gravura */
const Icons = {
  house: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="4" width="18" height="18" rx="1" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h2v2H8zM13 14h2v2h-2z" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 3h6v4H9zM9 12h6M9 16h4" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M12 21C12 21 3 14 3 8a4 4 0 018-1.5A4 4 0 0121 8c0 6-9 13-9 13z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M16 3a4 4 0 010 8M21 21v-2a4 4 0 00-3-3.87" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4 20h16M4 20V12M9 20V8M14 20V4M19 20v-6" />
    </svg>
  ),
  arrowLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  ),
} as const;

const navItems = [
  { to: 'schedule',    label: 'Cronograma',  icon: Icons.calendar,  roles: ['admin', 'catalog_manager', 'resident'] },
  { to: 'catalog',     label: 'Catálogo',    icon: Icons.clipboard, roles: ['admin', 'catalog_manager'] },
  { to: 'preferences', label: 'Preferências',icon: Icons.heart,     roles: ['admin', 'catalog_manager', 'resident'] },
  { to: 'members',     label: 'Membros',     icon: Icons.users,     roles: ['admin'] },
  { to: 'reports',     label: 'Relatórios',  icon: Icons.chart,     roles: ['admin'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { currentHouse, setCurrentHouse } = useHouse();
  const navigate = useNavigate();

  const handleLeave = () => {
    setCurrentHouse(null);
    navigate('/houses');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="marca">
        <div className="marca__icone">{Icons.house}</div>
        <div style={{ minWidth: 0 }}>
          <div className="nome">Casa Comigo</div>
          {currentHouse && <div className="sub">{currentHouse.name}</div>}
        </div>
      </div>

      {currentHouse && (
        <nav className="nav">
          {navItems
            .filter((item) => item.roles.includes(currentHouse.role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={`/houses/${currentHouse.id}/${item.to}`}
                className={({ isActive }) => `nav-item${isActive ? ' ativo' : ''}`}
              >
                <span className="nav-item__icone">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
        </nav>
      )}

      <div className="sidebar-rodape">
        {currentHouse && (
          <button className="trocar" onClick={handleLeave}>
            <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: 6, width: 14, height: 14 }}>
              {Icons.arrowLeft}
            </span>
            Trocar de casa
          </button>
        )}
        <div className="usuario">
          <div className="avatar avatar--sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="usuario__nome">{user?.name}</span>
            <button className="usuario__sair" onClick={handleLogout}>Sair</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
