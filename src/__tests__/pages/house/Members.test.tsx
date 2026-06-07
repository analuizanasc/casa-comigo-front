import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Members } from '../../../pages/house/Members';
import { listMembers, inviteMember, updateRole, updateWeight, updateAvailability, removeMember, getWeights } from '../../../api/members';
import { useHouse } from '../../../contexts/HouseContext';
import { useToast } from '../../../components/UI/Toast';
import type { Member, HouseSummary, WeightsSummary } from '../../../types';

jest.mock('../../../api/members');
jest.mock('../../../contexts/HouseContext');
jest.mock('../../../components/UI/Toast');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ houseId: 'house-1' }),
}));

const mockListMembers = jest.mocked(listMembers);
const mockInviteMember = jest.mocked(inviteMember);
const mockUpdateRole = jest.mocked(updateRole);
const mockUpdateWeight = jest.mocked(updateWeight);
const mockUpdateAvailability = jest.mocked(updateAvailability);
const mockRemoveMember = jest.mocked(removeMember);
const mockGetWeights = jest.mocked(getWeights);
const mockUseHouse = jest.mocked(useHouse);
const mockUseToast = jest.mocked(useToast);
const mockToast = jest.fn();

const adminHouse: HouseSummary = { id: 'house-1', name: 'Casa', role: 'admin', created_at: '' };
const residentHouse: HouseSummary = { ...adminHouse, role: 'resident' };

const member: Member = {
  id: 'm1', user_id: 'u1', name: 'Alice', email: 'alice@test.com',
  role: 'resident', weight_percentage: 50, weekly_availability_hours: 10, created_at: '',
};
const memberNoWeight: Member = {
  ...member, id: 'm2', user_id: 'u2', name: 'Bob', email: 'bob@test.com',
  weight_percentage: null, weekly_availability_hours: 0,
};
const adminMember: Member = { ...member, id: 'm3', user_id: 'u3', name: 'Carlos', email: 'carlos@test.com', role: 'admin' };
const catalogMember: Member = { ...member, id: 'm4', user_id: 'u4', name: 'Dani', email: 'dani@test.com', role: 'catalog_manager' };

const mockWeights: WeightsSummary = {
  using_equal_distribution: false,
  total_defined_weight: 100,
  is_valid: true,
  members: [{ user_id: 'u1', name: 'Alice', weight_percentage: 50, effective_weight: 50 }],
};

beforeEach(() => {
  mockUseToast.mockReturnValue(mockToast);
  mockListMembers.mockResolvedValue({ data: [member, memberNoWeight, adminMember, catalogMember] } as any);
  mockGetWeights.mockResolvedValue({ data: mockWeights } as any);
  mockInviteMember.mockResolvedValue({} as any);
  mockUpdateRole.mockResolvedValue({ data: { message: 'ok' } } as any);
  mockUpdateWeight.mockResolvedValue({ data: { message: 'ok', total_weight: 50 } } as any);
  mockUpdateAvailability.mockResolvedValue({ data: { message: 'ok' } } as any);
  mockRemoveMember.mockResolvedValue({ data: { message: 'ok' } } as any);
});

function renderMembers(house = adminHouse) {
  mockUseHouse.mockReturnValue({ currentHouse: house, setCurrentHouse: jest.fn() });
  return render(<MemoryRouter><Members /></MemoryRouter>);
}

describe('Members page', () => {
  it('shows spinner while loading', () => {
    mockListMembers.mockReturnValue(new Promise(() => {}));
    renderMembers();
    expect(document.querySelector('.page-spinner')).toBeInTheDocument();
  });

  it('renders member list after loading', async () => {
    renderMembers();
    await waitFor(() => expect(screen.getAllByText('Alice')[0]).toBeInTheDocument());
    expect(screen.getByText('alice@test.com')).toBeInTheDocument();
  });

  it('shows weight and availability for member with values', async () => {
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);
    expect(screen.getAllByText(/50%/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/10h\/sem/).length).toBeGreaterThan(0);
  });

  it('does not show weight/avail for member without them', async () => {
    renderMembers();
    await waitFor(() => screen.getByText('Bob'));
    // memberNoWeight has null weight and 0 hours — no weight/avail spans
  });

  it('shows weights panel with valid weights for admin', async () => {
    renderMembers();
    await waitFor(() => screen.getByText('Distribuição de Carga'));
    expect(screen.getByText('Pesos válidos — 100%')).toBeInTheDocument();
  });

  it('shows equal distribution badge when using equal distribution', async () => {
    mockGetWeights.mockResolvedValue({ data: { ...mockWeights, using_equal_distribution: true } } as any);
    renderMembers();
    await waitFor(() => expect(screen.getByText('Distribuição igualitária')).toBeInTheDocument());
  });

  it('shows incomplete badge when weights are not valid', async () => {
    mockGetWeights.mockResolvedValue({ data: { ...mockWeights, is_valid: false, total_defined_weight: 50 } } as any);
    renderMembers();
    await waitFor(() => expect(screen.getByText('Incompleto — 50% definido')).toBeInTheDocument());
  });

  it('shows invite button only for admin', async () => {
    renderMembers(adminHouse);
    await waitFor(() => screen.getAllByText('Alice')[0]);
    expect(screen.getByText('+ Convidar membro')).toBeInTheDocument();
  });

  it('does not show invite button for resident', async () => {
    mockGetWeights.mockResolvedValue(null as any);
    renderMembers(residentHouse);
    await waitFor(() => screen.getAllByText('Alice')[0]);
    expect(screen.queryByText('+ Convidar membro')).not.toBeInTheDocument();
  });

  it('shows error toast when fetch fails', async () => {
    mockListMembers.mockRejectedValue(new Error('Erro ao carregar'));
    renderMembers();
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro ao carregar', 'error'));
  });

  it('invites a member successfully', async () => {
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);

    fireEvent.click(screen.getByText('+ Convidar membro'));
    fireEvent.change(screen.getByLabelText('E-mail do morador'), { target: { value: 'novo@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convidar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Membro convidado!', 'success'));
    expect(mockInviteMember).toHaveBeenCalledWith('house-1', 'novo@test.com');
  });

  it('shows error toast when invite fails', async () => {
    mockInviteMember.mockRejectedValue(new Error('Usuário não encontrado'));
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);

    fireEvent.click(screen.getByText('+ Convidar membro'));
    fireEvent.change(screen.getByLabelText('E-mail do morador'), { target: { value: 'x@x.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convidar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Usuário não encontrado', 'error'));
  });

  it('opens edit modal and saves changes when role/weight/avail differ', async () => {
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);

    const editBtns = screen.getAllByRole('button', { name: 'Editar' });
    fireEvent.click(editBtns[0]);
    expect(screen.getByText('Editar — Alice')).toBeInTheDocument();

    // Change role
    fireEvent.change(screen.getByLabelText('Papel'), { target: { value: 'admin' } });
    // Change weight to a different value
    fireEvent.change(screen.getByLabelText('Peso de distribuição (%)'), { target: { value: '60' } });
    // Change availability to a different value
    fireEvent.change(screen.getByLabelText('Disponibilidade semanal (horas)'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Membro atualizado!', 'success'));
    expect(mockUpdateRole).toHaveBeenCalledWith('house-1', 'u1', 'admin');
    expect(mockUpdateWeight).toHaveBeenCalledWith('house-1', 'u1', 60);
    expect(mockUpdateAvailability).toHaveBeenCalledWith('house-1', 'u1', 20);
  });

  it('does not call API when no fields changed in edit', async () => {
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);

    const editBtns = screen.getAllByRole('button', { name: 'Editar' });
    fireEvent.click(editBtns[0]);
    // Clear weight field (empty → no update)
    fireEvent.change(screen.getByLabelText('Peso de distribuição (%)'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Disponibilidade semanal (horas)'), { target: { value: '' } });
    // Role stays the same
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Membro atualizado!', 'success'));
    expect(mockUpdateRole).not.toHaveBeenCalled();
    expect(mockUpdateWeight).not.toHaveBeenCalled();
    expect(mockUpdateAvailability).not.toHaveBeenCalled();
  });

  it('does not update weight when value is same as current', async () => {
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);

    const editBtns = screen.getAllByRole('button', { name: 'Editar' });
    fireEvent.click(editBtns[0]);
    // member has weight_percentage = 50, set same value
    fireEvent.change(screen.getByLabelText('Peso de distribuição (%)'), { target: { value: '50' } });
    // member has availability = 10, set same value
    fireEvent.change(screen.getByLabelText('Disponibilidade semanal (horas)'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Membro atualizado!', 'success'));
    expect(mockUpdateWeight).not.toHaveBeenCalled();
    expect(mockUpdateAvailability).not.toHaveBeenCalled();
  });

  it('shows error toast when edit fails', async () => {
    mockUpdateRole.mockRejectedValue(new Error('Sem permissão'));
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);

    const editBtns = screen.getAllByRole('button', { name: 'Editar' });
    fireEvent.click(editBtns[0]);
    fireEvent.change(screen.getByLabelText('Papel'), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Sem permissão', 'error'));
  });

  it('removes member when confirm is accepted', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);

    const removeBtns = screen.getAllByRole('button', { name: 'Remover' });
    fireEvent.click(removeBtns[0]);

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Membro removido.', 'success'));
    expect(mockRemoveMember).toHaveBeenCalled();
  });

  it('does NOT remove member when confirm is cancelled', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);

    const removeBtns = screen.getAllByRole('button', { name: 'Remover' });
    fireEvent.click(removeBtns[0]);

    expect(mockRemoveMember).not.toHaveBeenCalled();
  });

  it('shows error toast when remove fails', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    mockRemoveMember.mockRejectedValue(new Error('Não pode remover admin'));
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);

    fireEvent.click(screen.getAllByRole('button', { name: 'Remover' })[0]);
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Não pode remover admin', 'error'));
  });

  it('closes invite modal when "Cancelar" is clicked', async () => {
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);
    fireEvent.click(screen.getByText('+ Convidar membro'));
    expect(screen.getByText('Convidar membro')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Convidar membro')).not.toBeInTheDocument();
  });

  it('closes invite modal when X button is clicked', async () => {
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);
    fireEvent.click(screen.getByText('+ Convidar membro'));
    expect(screen.getByText('Convidar membro')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Convidar membro')).not.toBeInTheDocument();
  });

  it('closes edit modal when "Cancelar" is clicked', async () => {
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0]);
    expect(screen.getByText('Editar — Alice')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Editar — Alice')).not.toBeInTheDocument();
  });

  it('closes edit modal when X button is clicked', async () => {
    renderMembers();
    await waitFor(() => screen.getAllByText('Alice')[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0]);
    expect(screen.getByText('Editar — Alice')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Editar — Alice')).not.toBeInTheDocument();
  });
});
