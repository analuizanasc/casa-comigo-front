import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Houses } from '../../pages/Houses';
import { getMyHouses, createHouse, joinHouse } from '../../api/houses';
import { useHouse } from '../../contexts/HouseContext';
import { useToast } from '../../components/UI/Toast';
import type { HouseSummary } from '../../types';

jest.mock('../../api/houses');
jest.mock('../../contexts/HouseContext');
jest.mock('../../components/UI/Toast');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockGetMyHouses = jest.mocked(getMyHouses);
const mockCreateHouse = jest.mocked(createHouse);
const mockJoinHouse = jest.mocked(joinHouse);
const mockUseHouse = jest.mocked(useHouse);
const mockUseToast = jest.mocked(useToast);

const mockSetCurrentHouse = jest.fn();
const mockToast = jest.fn();

const house1: HouseSummary = { id: 'h1', name: 'Apto 42', role: 'admin', created_at: '' };

beforeEach(() => {
  mockUseHouse.mockReturnValue({ currentHouse: null, setCurrentHouse: mockSetCurrentHouse });
  mockUseToast.mockReturnValue(mockToast);
  mockGetMyHouses.mockResolvedValue({ data: [house1] } as any);
});

function renderHouses() {
  return render(<MemoryRouter><Houses /></MemoryRouter>);
}

describe('Houses page', () => {
  it('shows page spinner while loading', () => {
    mockGetMyHouses.mockReturnValue(new Promise(() => {}));
    renderHouses();
    expect(document.querySelector('.page-spinner')).toBeInTheDocument();
  });

  it('renders list of houses after loading', async () => {
    renderHouses();
    await waitFor(() => expect(screen.getByText('Apto 42')).toBeInTheDocument());
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('shows empty state when user has no houses', async () => {
    mockGetMyHouses.mockResolvedValue({ data: [] } as any);
    renderHouses();
    await waitFor(() => expect(screen.getByText('Você ainda não faz parte de nenhuma casa.')).toBeInTheDocument());
  });

  it('sets current house and navigates on house card click', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('Apto 42').closest('button')!);
    expect(mockSetCurrentHouse).toHaveBeenCalledWith(house1);
    expect(mockNavigate).toHaveBeenCalledWith('/houses/h1/schedule');
  });

  it('shows error toast when fetching houses fails', async () => {
    mockGetMyHouses.mockRejectedValue(new Error('Erro de rede'));
    renderHouses();
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro de rede', 'error'));
  });

  it('opens create modal when "+ Nova casa" is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('+ Nova casa'));
    expect(screen.getByText('Criar nova casa')).toBeInTheDocument();
  });

  it('creates a house and refreshes list on form submit', async () => {
    mockCreateHouse.mockResolvedValue({ data: { id: 'h2', name: 'Nova Casa' } } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));

    fireEvent.click(screen.getByText('+ Nova casa'));
    fireEvent.change(screen.getByLabelText('Nome da casa'), { target: { value: 'Nova Casa' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Casa criada com sucesso!', 'success'));
    expect(mockCreateHouse).toHaveBeenCalledWith('Nova Casa');
  });

  it('shows error toast when create house fails', async () => {
    mockCreateHouse.mockRejectedValue(new Error('Falha ao criar'));
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));

    fireEvent.click(screen.getByText('+ Nova casa'));
    fireEvent.change(screen.getByLabelText('Nome da casa'), { target: { value: 'X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Falha ao criar', 'error'));
  });

  it('opens join modal when "Entrar com código" is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('Entrar com código'));
    expect(screen.getByText('Entrar com código de convite')).toBeInTheDocument();
  });

  it('joins a house and refreshes list on form submit', async () => {
    mockJoinHouse.mockResolvedValue({ data: { id: 'h3' } } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));

    fireEvent.click(screen.getByText('Entrar com código'));
    fireEvent.change(screen.getByLabelText('Código de convite'), { target: { value: 'abc123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Você entrou na casa!', 'success'));
    expect(mockJoinHouse).toHaveBeenCalledWith('ABC123');
  });

  it('shows error toast when join house fails', async () => {
    mockJoinHouse.mockRejectedValue(new Error('Código inválido'));
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));

    fireEvent.click(screen.getByText('Entrar com código'));
    fireEvent.change(screen.getByLabelText('Código de convite'), { target: { value: 'bad' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Código inválido', 'error'));
  });

  it('closes create modal when "Cancelar" is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('+ Nova casa'));
    expect(screen.getByText('Criar nova casa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Criar nova casa')).not.toBeInTheDocument();
  });

  it('closes create modal when X button is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('+ Nova casa'));
    expect(screen.getByText('Criar nova casa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Criar nova casa')).not.toBeInTheDocument();
  });

  it('closes join modal when "Cancelar" is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('Entrar com código'));
    expect(screen.getByText('Entrar com código de convite')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Entrar com código de convite')).not.toBeInTheDocument();
  });

  it('closes join modal when X button is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('Entrar com código'));
    expect(screen.getByText('Entrar com código de convite')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Entrar com código de convite')).not.toBeInTheDocument();
  });
});
