import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Schedule } from '../../../pages/house/Schedule';
import { getSchedule, completeTask, reportImpediment, reassignTask, distribute } from '../../../api/schedule';
import { listMembers } from '../../../api/members';
import { useHouse } from '../../../contexts/HouseContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/UI/Toast';
import type { Assignment, Member, HouseSummary, DistributionResult } from '../../../types';

jest.mock('../../../api/schedule');
jest.mock('../../../api/members');
jest.mock('../../../contexts/HouseContext');
jest.mock('../../../contexts/AuthContext');
jest.mock('../../../components/UI/Toast');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ houseId: 'house-1' }),
}));

const mockGetSchedule = jest.mocked(getSchedule);
const mockCompleteTask = jest.mocked(completeTask);
const mockReportImpediment = jest.mocked(reportImpediment);
const mockReassignTask = jest.mocked(reassignTask);
const mockDistribute = jest.mocked(distribute);
const mockListMembers = jest.mocked(listMembers);
const mockUseHouse = jest.mocked(useHouse);
const mockUseAuth = jest.mocked(useAuth);
const mockUseToast = jest.mocked(useToast);
const mockToast = jest.fn();

const adminHouse: HouseSummary = { id: 'house-1', name: 'Casa', role: 'admin', created_at: '' };
const catalogHouse: HouseSummary = { ...adminHouse, role: 'catalog_manager' };
const residentHouse: HouseSummary = { ...adminHouse, role: 'resident' };

const currentUser = { id: 'u1', name: 'Alice', email: 'a@a.com', created_at: '' };
const otherUser = { id: 'u2', name: 'Bob', email: 'b@b.com', created_at: '' };

const baseAssignment: Assignment = {
  id: 'a1', house_id: 'house-1', task_id: 't1', task_name: 'Varrer',
  frequency: 'weekly', duration_minutes: 30, effort_level: 'light',
  room: 'Sala', assigned_to: 'u1', assigned_to_name: 'Alice',
  scheduled_date: '2024-01-15', status: 'pending',
  completed_at: null, completion_notes: null, group_id: null, sequence_order: 1,
};
const completedAssignment: Assignment = {
  ...baseAssignment, id: 'a2', status: 'completed', completion_notes: 'Feito!',
};
const overdueAssignment: Assignment = { ...baseAssignment, id: 'a3', status: 'overdue' };
const redistributedAssignment: Assignment = { ...baseAssignment, id: 'a4', status: 'redistributed' };
const otherUserAssignment: Assignment = {
  ...baseAssignment, id: 'a5', assigned_to: 'u2', assigned_to_name: 'Bob',
};
const noRoomAssignment: Assignment = { ...baseAssignment, id: 'a6', room: null };

const member: Member = {
  id: 'm1', user_id: 'u2', name: 'Bob', email: 'b@b.com',
  role: 'resident', weight_percentage: null, weekly_availability_hours: 8, created_at: '',
};

const distResult: DistributionResult = {
  period_start: '2024-01-01', period_end: '2024-01-31',
  total_tasks_assigned: 10, within_tolerance: true,
  balance: [{ user_id: 'u1', name: 'Alice', target_percentage: 50, actual_percentage: 50, deviation: 0, within_tolerance: true }],
};
const distResultOutOfTolerance: DistributionResult = {
  ...distResult, within_tolerance: false,
  balance: [{ user_id: 'u1', name: 'Alice', target_percentage: 50, actual_percentage: 70, deviation: 20, within_tolerance: false }],
};

function setup(house = adminHouse, user = currentUser) {
  mockUseHouse.mockReturnValue({ currentHouse: house, setCurrentHouse: jest.fn() });
  mockUseAuth.mockReturnValue({ user, token: 'tok', isAuthenticated: true, login: jest.fn(), logout: jest.fn() });
  mockUseToast.mockReturnValue(mockToast);
  mockListMembers.mockResolvedValue({ data: [member] } as any);
  mockCompleteTask.mockResolvedValue({ data: baseAssignment } as any);
  mockReportImpediment.mockResolvedValue({ data: { message: 'Redistribuído', new_assignment: {} } } as any);
  mockReassignTask.mockResolvedValue({ data: baseAssignment } as any);
  mockDistribute.mockResolvedValue({ data: distResult } as any);
}

function renderSchedule() {
  return render(<MemoryRouter><Schedule /></MemoryRouter>);
}

describe('Schedule page', () => {
  it('shows spinner while loading', () => {
    setup();
    mockGetSchedule.mockReturnValue(new Promise(() => {}));
    renderSchedule();
    expect(document.querySelector('.page-spinner')).toBeInTheDocument();
  });

  it('shows empty state with admin hint when no assignments', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByText('Nenhuma tarefa neste período.')).toBeInTheDocument());
    expect(screen.getByText('Use "Distribuir tarefas" para gerar o cronograma.')).toBeInTheDocument();
  });

  it('shows empty state without admin hint for resident', async () => {
    setup(residentHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByText('Nenhuma tarefa neste período.')).toBeInTheDocument());
    expect(screen.queryByText(/Distribuir/)).not.toBeInTheDocument();
  });

  it('renders assignments grouped by date', async () => {
    setup();
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByText('Varrer')).toBeInTheDocument());
    expect(screen.getByText(/1 tarefa$/)).toBeInTheDocument();
  });

  it('shows "tarefas" (plural) when day has multiple assignments', async () => {
    setup();
    const a2 = { ...baseAssignment, id: 'a2' };
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment, a2] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByText('2 tarefas')).toBeInTheDocument());
  });

  it('shows completion notes when present', async () => {
    setup();
    mockGetSchedule.mockResolvedValue({ data: [completedAssignment] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByText(/Feito!/)).toBeInTheDocument());
  });

  it('does not show room when room is null', async () => {
    setup();
    mockGetSchedule.mockResolvedValue({ data: [noRoomAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('Varrer'));
    // Should not throw or show room element
  });

  it('shows distribute button for admin', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByText('⚡ Distribuir tarefas')).toBeInTheDocument());
  });

  it('does not show distribute button for resident', async () => {
    setup(residentHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('Nenhuma tarefa neste período.'));
    expect(screen.queryByText('⚡ Distribuir tarefas')).not.toBeInTheDocument();
  });

  it('shows assignee name for admin/catalog manager', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByText(/Alice/)).toBeInTheDocument());
  });

  it('does not show member filter for resident', async () => {
    setup(residentHouse);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('Varrer'));
    expect(screen.queryByLabelText('Morador')).not.toBeInTheDocument();
  });

  it('shows Concluir and Impedimento buttons for pending task assigned to current user', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByText('✓ Concluir')).toBeInTheDocument());
    expect(screen.getByText('⚠ Impedimento')).toBeInTheDocument();
  });

  it('shows Concluir but NOT Impedimento for pending task assigned to another user', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [otherUserAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('Varrer'));
    expect(screen.getByText('✓ Concluir')).toBeInTheDocument();
    expect(screen.queryByText('⚠ Impedimento')).not.toBeInTheDocument();
  });

  it('shows Reatribuir button only for admin on pending tasks', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByText('↩ Reatribuir')).toBeInTheDocument());
  });

  it('completes a task via modal', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('✓ Concluir'));

    fireEvent.click(screen.getByText('✓ Concluir'));
    fireEvent.change(screen.getByLabelText('Observação (opcional)'), { target: { value: 'OK!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Tarefa concluída!', 'success'));
    expect(mockCompleteTask).toHaveBeenCalledWith('house-1', 'a1', 'OK!');
  });

  it('completes task without notes', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('✓ Concluir'));

    fireEvent.click(screen.getByText('✓ Concluir'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => expect(mockCompleteTask).toHaveBeenCalledWith('house-1', 'a1', undefined));
  });

  it('shows error toast when complete fails', async () => {
    setup(adminHouse, currentUser);
    mockCompleteTask.mockRejectedValue(new Error('Falha'));
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('✓ Concluir'));

    fireEvent.click(screen.getByText('✓ Concluir'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Falha', 'error'));
  });

  it('reports impediment when confirm is accepted', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚠ Impedimento'));

    fireEvent.click(screen.getByText('⚠ Impedimento'));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Redistribuído', 'success'));
    expect(mockReportImpediment).toHaveBeenCalledWith('house-1', 'a1');
  });

  it('does not report impediment when confirm is cancelled', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚠ Impedimento'));

    fireEvent.click(screen.getByText('⚠ Impedimento'));
    expect(mockReportImpediment).not.toHaveBeenCalled();
  });

  it('shows error toast when impediment fails', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    setup(adminHouse, currentUser);
    mockReportImpediment.mockRejectedValue(new Error('Erro impedimento'));
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚠ Impedimento'));

    fireEvent.click(screen.getByText('⚠ Impedimento'));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro impedimento', 'error'));
  });

  it('reassigns a task via modal', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Tarefa reatribuída!', 'success'));
    expect(mockReassignTask).toHaveBeenCalledWith('house-1', 'a1', { assigned_to: 'u2' });
  });

  it('shows error toast when reassign fails', async () => {
    setup(adminHouse, currentUser);
    mockReassignTask.mockRejectedValue(new Error('Erro reatribuição'));
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro reatribuição', 'error'));
  });

  it('distributes tasks and shows result within tolerance', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚡ Distribuir tarefas'));

    fireEvent.click(screen.getByText('⚡ Distribuir tarefas'));
    expect(screen.getByText('Gerar distribuição')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Gerar distribuição' }));
    await waitFor(() => expect(screen.getByText('✓ Dentro da tolerância')).toBeInTheDocument());
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows out of tolerance result', async () => {
    setup(adminHouse);
    mockDistribute.mockResolvedValue({ data: distResultOutOfTolerance } as any);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚡ Distribuir tarefas'));

    fireEvent.click(screen.getByText('⚡ Distribuir tarefas'));
    fireEvent.click(screen.getByRole('button', { name: 'Gerar distribuição' }));

    await waitFor(() => expect(screen.getByText('⚠ Fora da tolerância')).toBeInTheDocument());
  });

  it('shows error toast when distribute fails', async () => {
    setup(adminHouse);
    mockDistribute.mockRejectedValue(new Error('Erro ao distribuir'));
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚡ Distribuir tarefas'));

    fireEvent.click(screen.getByText('⚡ Distribuir tarefas'));
    fireEvent.click(screen.getByRole('button', { name: 'Gerar distribuição' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro ao distribuir', 'error'));
  });

  it('shows error toast when getSchedule fails', async () => {
    setup(adminHouse);
    mockGetSchedule.mockRejectedValue(new Error('Erro de rede'));
    renderSchedule();
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro de rede', 'error'));
  });

  it('shows member filter for catalog_manager', async () => {
    setup(catalogHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('Nenhuma tarefa neste período.'));
    expect(screen.getByLabelText('Morador')).toBeInTheDocument();
  });

  it('changes date-from filter and refetches schedule', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('Nenhuma tarefa neste período.'));

    fireEvent.change(screen.getByLabelText('De'), { target: { value: '2024-02-01' } });
    await waitFor(() => expect(mockGetSchedule).toHaveBeenCalledTimes(2));
  });

  it('changes date-to filter and refetches schedule', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('Nenhuma tarefa neste período.'));

    fireEvent.change(screen.getByLabelText('Até'), { target: { value: '2024-02-28' } });
    await waitFor(() => expect(mockGetSchedule).toHaveBeenCalledTimes(2));
  });

  it('changes member filter and refetches with assigned_to', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => expect(screen.getByLabelText('Morador')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Morador'), { target: { value: 'u2' } });
    await waitFor(() =>
      expect(mockGetSchedule).toHaveBeenCalledWith(
        'house-1',
        expect.objectContaining({ assigned_to: 'u2' })
      )
    );
  });

  it('closes complete modal when "Cancelar" is clicked', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('✓ Concluir'));

    fireEvent.click(screen.getByText('✓ Concluir'));
    expect(screen.getByText('Concluir tarefa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Concluir tarefa')).not.toBeInTheDocument();
  });

  it('closes complete modal when X button is clicked', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('✓ Concluir'));

    fireEvent.click(screen.getByText('✓ Concluir'));
    expect(screen.getByText('Concluir tarefa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Concluir tarefa')).not.toBeInTheDocument();
  });

  it('closes reassign modal when "Cancelar" is clicked', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    expect(screen.getByText('Reatribuir tarefa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Reatribuir tarefa')).not.toBeInTheDocument();
  });

  it('closes reassign modal when X button is clicked', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    expect(screen.getByText('Reatribuir tarefa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Reatribuir tarefa')).not.toBeInTheDocument();
  });

  it('closes distribute modal when "Cancelar" is clicked', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚡ Distribuir tarefas'));

    fireEvent.click(screen.getByText('⚡ Distribuir tarefas'));
    expect(screen.getByText('Distribuição automática')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Distribuição automática')).not.toBeInTheDocument();
  });

  it('closes distribute modal when X button is clicked', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚡ Distribuir tarefas'));

    fireEvent.click(screen.getByText('⚡ Distribuir tarefas'));
    expect(screen.getByText('Distribuição automática')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Fechar' })[0]);
    expect(screen.queryByText('Distribuição automática')).not.toBeInTheDocument();
  });

  it('closes distribute modal via footer "Fechar" button after result', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚡ Distribuir tarefas'));

    fireEvent.click(screen.getByText('⚡ Distribuir tarefas'));
    fireEvent.click(screen.getByRole('button', { name: 'Gerar distribuição' }));
    await waitFor(() => screen.getByText('✓ Dentro da tolerância'));

    const fecharBtns = screen.getAllByRole('button', { name: 'Fechar' });
    fireEvent.click(fecharBtns[fecharBtns.length - 1]);
    expect(screen.queryByText('Distribuição automática')).not.toBeInTheDocument();
  });

  it('updates distribute start and end date fields', async () => {
    setup(adminHouse);
    mockGetSchedule.mockResolvedValue({ data: [] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('⚡ Distribuir tarefas'));

    fireEvent.click(screen.getByText('⚡ Distribuir tarefas'));
    fireEvent.change(screen.getByLabelText('Início do período'), { target: { value: '2024-03-01' } });
    fireEvent.change(screen.getByLabelText('Fim do período'), { target: { value: '2024-03-31' } });
    fireEvent.click(screen.getByRole('button', { name: 'Gerar distribuição' }));

    await waitFor(() =>
      expect(mockDistribute).toHaveBeenCalledWith('house-1', {
        period_start: '2024-03-01',
        period_end: '2024-03-31',
      })
    );
  });

  it('shows warning toast when reassign returns a warning message', async () => {
    setup(adminHouse, currentUser);
    mockReassignTask.mockResolvedValue({ data: { ...baseAssignment, warning: 'Carga elevada' } } as any);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Carga elevada', 'warning'));
  });

  it('shows group confirm modal when reassign requires confirmation', async () => {
    setup(adminHouse, currentUser);
    const confirmPayload = {
      requires_confirmation: true,
      warning: 'Tarefa pertence a um grupo',
      group_task_count: 3,
      options: { move_single: 'Mover só esta', move_group: 'Mover todo o grupo' },
    };
    mockReassignTask.mockResolvedValueOnce({ data: confirmPayload } as any);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => expect(screen.getByText('Tarefa pertence a um grupo')).toBeInTheDocument());
    expect(screen.getByText('Mover só esta')).toBeInTheDocument();
    expect(screen.getByText('Mover todo o grupo')).toBeInTheDocument();
  });

  it('confirms group reassign moving only single task', async () => {
    setup(adminHouse, currentUser);
    const confirmPayload = {
      requires_confirmation: true,
      warning: 'Grupo detectado',
      group_task_count: 3,
      options: { move_single: 'Mover só esta', move_group: 'Mover todo o grupo' },
    };
    mockReassignTask
      .mockResolvedValueOnce({ data: confirmPayload } as any)
      .mockResolvedValueOnce({ data: baseAssignment } as any);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => screen.getByText('Mover só esta'));
    fireEvent.click(screen.getByText('Mover só esta'));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Tarefa reatribuída!', 'success'));
    expect(mockReassignTask).toHaveBeenLastCalledWith('house-1', 'a1', {
      assigned_to: 'u2', force: true, move_group: false,
    });
  });

  it('confirms group reassign moving entire group', async () => {
    setup(adminHouse, currentUser);
    const confirmPayload = {
      requires_confirmation: true,
      warning: 'Grupo detectado',
      group_task_count: 3,
      options: { move_single: 'Mover só esta', move_group: 'Mover todo o grupo' },
    };
    mockReassignTask
      .mockResolvedValueOnce({ data: confirmPayload } as any)
      .mockResolvedValueOnce({ data: baseAssignment } as any);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => screen.getByText('Mover todo o grupo'));
    fireEvent.click(screen.getByText('Mover todo o grupo'));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Tarefa reatribuída!', 'success'));
    expect(mockReassignTask).toHaveBeenLastCalledWith('house-1', 'a1', {
      assigned_to: 'u2', force: true, move_group: true,
    });
  });

  it('shows error toast when group confirm reassign fails', async () => {
    setup(adminHouse, currentUser);
    const confirmPayload = {
      requires_confirmation: true,
      warning: 'Grupo detectado',
      group_task_count: 2,
      options: { move_single: 'Mover só esta', move_group: 'Mover todo o grupo' },
    };
    mockReassignTask
      .mockResolvedValueOnce({ data: confirmPayload } as any)
      .mockRejectedValueOnce(new Error('Falha na reatribuição em grupo'));
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => screen.getByText('Mover só esta'));
    fireEvent.click(screen.getByText('Mover só esta'));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Falha na reatribuição em grupo', 'error'));
  });

  it('returns early when reassign is submitted without selecting a member', async () => {
    setup(adminHouse, currentUser);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    expect(mockReassignTask).not.toHaveBeenCalled();
  });

  it('hides Impedimento button when user is null', async () => {
    mockUseHouse.mockReturnValue({ currentHouse: adminHouse, setCurrentHouse: jest.fn() });
    mockUseAuth.mockReturnValue({ user: null, token: null, isAuthenticated: false, login: jest.fn(), logout: jest.fn() });
    mockUseToast.mockReturnValue(mockToast);
    mockListMembers.mockResolvedValue({ data: [member] } as any);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();

    await waitFor(() => screen.getByText('Varrer'));
    expect(screen.queryByText('⚠ Impedimento')).not.toBeInTheDocument();
  });

  it('closes group confirm modal when X (Fechar) button is clicked', async () => {
    setup(adminHouse, currentUser);
    const confirmPayload = {
      requires_confirmation: true,
      warning: 'Grupo detectado',
      group_task_count: 2,
      options: { move_single: 'Mover só esta', move_group: 'Mover todo o grupo' },
    };
    mockReassignTask.mockResolvedValueOnce({ data: confirmPayload } as any);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => screen.getByText('Mover só esta'));
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Mover só esta')).not.toBeInTheDocument();
  });

  it('closes group confirm modal when Cancelar is clicked', async () => {
    setup(adminHouse, currentUser);
    const confirmPayload = {
      requires_confirmation: true,
      warning: 'Grupo detectado',
      group_task_count: 2,
      options: { move_single: 'Mover só esta', move_group: 'Mover todo o grupo' },
    };
    mockReassignTask.mockResolvedValueOnce({ data: confirmPayload } as any);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => screen.getByText('Mover só esta'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Mover só esta')).not.toBeInTheDocument();
  });

  it('shows warning toast when group confirm reassign returns a warning', async () => {
    setup(adminHouse, currentUser);
    const confirmPayload = {
      requires_confirmation: true,
      warning: 'Grupo detectado',
      group_task_count: 2,
      options: { move_single: 'Mover só esta', move_group: 'Mover todo o grupo' },
    };
    mockReassignTask
      .mockResolvedValueOnce({ data: confirmPayload } as any)
      .mockResolvedValueOnce({ data: { ...baseAssignment, warning: 'Atenção: carga alta' } } as any);
    mockGetSchedule.mockResolvedValue({ data: [baseAssignment] } as any);
    renderSchedule();
    await waitFor(() => screen.getByText('↩ Reatribuir'));

    fireEvent.click(screen.getByText('↩ Reatribuir'));
    fireEvent.change(screen.getByLabelText('Novo responsável'), { target: { value: 'u2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reatribuir' }));

    await waitFor(() => screen.getByText('Mover só esta'));
    fireEvent.click(screen.getByText('Mover só esta'));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Atenção: carga alta', 'warning'));
  });
});
