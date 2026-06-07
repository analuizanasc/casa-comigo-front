import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../../pages/Login';
import { login as loginApi } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/UI/Toast';

jest.mock('../../api/auth');
jest.mock('../../contexts/AuthContext');
jest.mock('../../components/UI/Toast');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockLoginApi = jest.mocked(loginApi);
const mockUseAuth = jest.mocked(useAuth);
const mockUseToast = jest.mocked(useToast);

const mockLogin = jest.fn();
const mockToast = jest.fn();

beforeEach(() => {
  mockUseAuth.mockReturnValue({
    login: mockLogin, logout: jest.fn(), user: null, token: null, isAuthenticated: false,
  });
  mockUseToast.mockReturnValue(mockToast);
});

function renderLogin() {
  return render(<MemoryRouter><Login /></MemoryRouter>);
}

describe('Login page', () => {
  it('renders email, password inputs and submit button', () => {
    renderLogin();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('renders link to register page', () => {
    renderLogin();
    expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
  });

  it('logs in, calls auth login and navigates to /houses on success', async () => {
    const userData = { id: '1', name: 'Ana', email: 'ana@test.com', created_at: '' };
    mockLoginApi.mockResolvedValue({ data: { token: 'tok123', user: userData } } as any);

    renderLogin();
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@test.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('tok123', userData));
    expect(mockNavigate).toHaveBeenCalledWith('/houses');
  });

  it('shows error toast when login API fails', async () => {
    mockLoginApi.mockRejectedValue(new Error('Credenciais inválidas'));

    renderLogin();
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'x@x.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Credenciais inválidas', 'error'));
  });

  it('disables submit button while loading', async () => {
    mockLoginApi.mockReturnValue(new Promise(() => {}));

    renderLogin();
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeDisabled();
  });
});
