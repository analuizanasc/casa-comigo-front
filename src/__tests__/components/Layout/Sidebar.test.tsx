import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '../../../components/Layout/Sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { useHouse } from '../../../contexts/HouseContext';
import type { HouseSummary } from '../../../types';

jest.mock('../../../contexts/AuthContext');
jest.mock('../../../contexts/HouseContext');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockUseAuth = jest.mocked(useAuth);
const mockUseHouse = jest.mocked(useHouse);
const mockLogout = jest.fn();
const mockSetCurrentHouse = jest.fn();

const adminHouse: HouseSummary = { id: 'h1', name: 'Casa Admin', role: 'admin', created_at: '' };
const catalogHouse: HouseSummary = { id: 'h2', name: 'Casa Catalog', role: 'catalog_manager', created_at: '' };
const residentHouse: HouseSummary = { id: 'h3', name: 'Casa Resident', role: 'resident', created_at: '' };

function setup(currentHouse: HouseSummary | null = null) {
  mockUseAuth.mockReturnValue({
    user: { id: 'u1', name: 'Alice', email: 'a@a.com', created_at: '' },
    token: 'tok',
    isAuthenticated: true,
    login: jest.fn(),
    logout: mockLogout,
  });
  mockUseHouse.mockReturnValue({ currentHouse, setCurrentHouse: mockSetCurrentHouse });
  return render(<MemoryRouter><Sidebar /></MemoryRouter>);
}

describe('Sidebar', () => {
  it('renders brand name Casa Comigo', () => {
    setup();
    expect(screen.getByText('Casa Comigo')).toBeInTheDocument();
  });

  it('shows first letter of user name in avatar', () => {
    setup();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('shows user name in sidebar footer', () => {
    setup();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('does not show nav links when no current house is set', () => {
    setup(null);
    expect(screen.queryByText('Cronograma')).not.toBeInTheDocument();
  });

  it('does not show Trocar de casa button when no current house', () => {
    setup(null);
    expect(screen.queryByText(/Trocar de casa/)).not.toBeInTheDocument();
  });

  it('shows house name and nav when current house is set', () => {
    setup(adminHouse);
    expect(screen.getByText('Casa Admin')).toBeInTheDocument();
    expect(screen.getByText('Cronograma')).toBeInTheDocument();
  });

  it('shows all 5 nav items for admin role', () => {
    setup(adminHouse);
    expect(screen.getByText('Cronograma')).toBeInTheDocument();
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
    expect(screen.getByText('Preferências')).toBeInTheDocument();
    expect(screen.getByText('Membros')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('shows Cronograma, Catálogo and Preferências for catalog_manager (no Membros, no Relatórios)', () => {
    setup(catalogHouse);
    expect(screen.getByText('Cronograma')).toBeInTheDocument();
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
    expect(screen.getByText('Preferências')).toBeInTheDocument();
    expect(screen.queryByText('Membros')).not.toBeInTheDocument();
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
  });

  it('shows only Cronograma and Preferências for resident (no Catálogo, Membros, Relatórios)', () => {
    setup(residentHouse);
    expect(screen.getByText('Cronograma')).toBeInTheDocument();
    expect(screen.getByText('Preferências')).toBeInTheDocument();
    expect(screen.queryByText('Catálogo')).not.toBeInTheDocument();
    expect(screen.queryByText('Membros')).not.toBeInTheDocument();
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
  });

  it('calls logout and navigates to /login when Sair is clicked', () => {
    setup();
    fireEvent.click(screen.getByText('Sair'));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls setCurrentHouse(null) and navigates to /houses when Trocar de casa is clicked', () => {
    setup(adminHouse);
    fireEvent.click(screen.getByText(/Trocar de casa/));
    expect(mockSetCurrentHouse).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('/houses');
  });

  it('adds ativo class to the nav link matching the current route', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', name: 'Alice', email: 'a@a.com', created_at: '' },
      token: 'tok',
      isAuthenticated: true,
      login: jest.fn(),
      logout: mockLogout,
    });
    mockUseHouse.mockReturnValue({ currentHouse: adminHouse, setCurrentHouse: mockSetCurrentHouse });
    render(<MemoryRouter initialEntries={['/houses/h1/schedule']}><Sidebar /></MemoryRouter>);
    expect(screen.getByText('Cronograma').closest('a')).toHaveClass('ativo');
  });

  it('renders empty avatar when user is null', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: mockLogout,
    });
    mockUseHouse.mockReturnValue({ currentHouse: null, setCurrentHouse: mockSetCurrentHouse });
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    const avatar = document.querySelector('.avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar?.textContent).toBe('');
  });
});
