import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Register } from '../../pages/Register';
import { register as registerApi } from '../../api/auth';
import { useToast } from '../../components/UI/Toast';

jest.mock('../../api/auth');
jest.mock('../../components/UI/Toast');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockRegisterApi = jest.mocked(registerApi);
const mockUseToast = jest.mocked(useToast);
const mockToast = jest.fn();

beforeEach(() => {
  mockUseToast.mockReturnValue(mockToast);
});

function renderRegister() {
  return render(<MemoryRouter><Register /></MemoryRouter>);
}

describe('Register page', () => {
  it('renders name, email, password inputs and submit button', () => {
    renderRegister();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument();
  });

  it('renders link to login page', () => {
    renderRegister();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('shows error toast and does NOT call API when password is less than 6 chars', async () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'b@b.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith('A senha deve ter no mínimo 6 caracteres.', 'error')
    );
    expect(mockRegisterApi).not.toHaveBeenCalled();
  });

  it('registers successfully, shows toast and navigates to /login', async () => {
    mockRegisterApi.mockResolvedValue({ data: { message: 'ok', user: {} } } as any);

    renderRegister();
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'b@b.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith('Conta criada! Faça login para continuar.', 'success')
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows error toast when API fails', async () => {
    mockRegisterApi.mockRejectedValue(new Error('E-mail já cadastrado'));

    renderRegister();
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'b@b.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith('E-mail já cadastrado', 'error')
    );
  });

  it('disables submit button while loading', async () => {
    mockRegisterApi.mockReturnValue(new Promise(() => {}));

    renderRegister();
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'b@b.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeDisabled();
  });
});
