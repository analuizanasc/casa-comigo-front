import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../../../components/Layout/AppLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { useHouse } from '../../../contexts/HouseContext';

jest.mock('../../../contexts/AuthContext');
jest.mock('../../../contexts/HouseContext');

const mockUseAuth = jest.mocked(useAuth);
const mockUseHouse = jest.mocked(useHouse);

function setupMocks(isAuthenticated: boolean) {
  mockUseAuth.mockReturnValue({
    isAuthenticated,
    user: { id: '1', name: 'Ana', email: 'ana@test.com', created_at: '' },
    token: isAuthenticated ? 'tok' : null,
    login: jest.fn(),
    logout: jest.fn(),
  });
  mockUseHouse.mockReturnValue({
    currentHouse: null,
    setCurrentHouse: jest.fn(),
  });
}

describe('AppLayout', () => {
  it('redirects to /login when user is not authenticated', () => {
    setupMocks(false);
    render(
      <MemoryRouter initialEntries={['/houses']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/houses" element={<div>Houses Page</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Houses Page')).not.toBeInTheDocument();
  });

  it('renders the Outlet content when user is authenticated', () => {
    setupMocks(true);
    render(
      <MemoryRouter initialEntries={['/houses']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/houses" element={<div>Houses Page</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Houses Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
