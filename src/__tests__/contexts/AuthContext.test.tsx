import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types';

const mockUser: User = { id: '1', name: 'Alice', email: 'alice@test.com', created_at: '2024-01-01' };

function TestConsumer() {
  const { user, token, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user?.name ?? 'null'}</span>
      <span data-testid="token">{token ?? 'null'}</span>
      <span data-testid="auth">{String(isAuthenticated)}</span>
      <button onClick={() => login('new-token', mockUser)}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());

  it('starts unauthenticated when localStorage is empty', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    expect(screen.getByTestId('auth')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('token')).toHaveTextContent('null');
  });

  it('reads initial state from localStorage when token and user exist', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    expect(screen.getByTestId('auth')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('Alice');
    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
  });

  it('login saves token and user to state and localStorage', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByTestId('auth')).toHaveTextContent('true');
    expect(screen.getByTestId('token')).toHaveTextContent('new-token');
    expect(screen.getByTestId('user')).toHaveTextContent('Alice');
    expect(localStorage.getItem('token')).toBe('new-token');
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser);
  });

  it('logout clears state and localStorage', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('auth')).toHaveTextContent('false');
    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('useAuth throws when used outside AuthProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within AuthProvider');
    consoleSpy.mockRestore();
  });
});
