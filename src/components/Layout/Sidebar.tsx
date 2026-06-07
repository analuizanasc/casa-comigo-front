import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHouse } from '../../contexts/HouseContext';

const navItems = [
  { to: 'schedule', label: 'Cronograma', icon: '📅', roles: ['admin', 'catalog_manager', 'resident'] },
  { to: 'catalog', label: 'Catálogo', icon: '📋', roles: ['admin', 'catalog_manager'] },
  { to: 'preferences', label: 'Preferências', icon: '❤️', roles: ['admin', 'catalog_manager', 'resident'] },
  { to: 'members', label: 'Membros', icon: '👥', roles: ['admin'] },
  { to: 'reports', label: 'Relatórios', icon: '📊', roles: ['admin'] },
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
      <div className="sidebar__brand">
        <span className="sidebar__logo">🏠</span>
        <div>
          <div className="sidebar__app-name">Casa Comigo</div>
          {currentHouse && (
            <div className="sidebar__house-name">{currentHouse.name}</div>
          )}
        </div>
      </div>

      {currentHouse && (
        <nav className="sidebar__nav">
          {navItems
            .filter((item) => item.roles.includes(currentHouse.role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={`/houses/${currentHouse.id}/${item.to}`}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
              >
                <span className="sidebar__link-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
        </nav>
      )}

      <div className="sidebar__footer">
        {currentHouse && (
          <button className="sidebar__action" onClick={handleLeave}>
            ← Trocar de casa
          </button>
        )}
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{user?.name}</span>
            <button className="sidebar__logout" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
