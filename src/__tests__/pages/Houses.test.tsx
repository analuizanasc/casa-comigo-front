import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Houses } from '../../pages/Houses';
import { getMyHouses, createHouse, joinHouse } from '../../api/houses';
import { listInvitations, acceptInvitation, rejectInvitation } from '../../api/invitations';
import { listNotifications, markAllRead } from '../../api/notifications';
import { getOnboarding, advanceOnboarding } from '../../api/me';
import { useHouse } from '../../contexts/HouseContext';
import { useToast } from '../../components/UI/Toast';
import type { HouseSummary, Invitation, AppNotification, OnboardingStatus } from '../../types';

jest.mock('../../api/houses');
jest.mock('../../api/invitations');
jest.mock('../../api/notifications');
jest.mock('../../api/me');
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
const mockListInvitations = jest.mocked(listInvitations);
const mockAcceptInvitation = jest.mocked(acceptInvitation);
const mockRejectInvitation = jest.mocked(rejectInvitation);
const mockListNotifications = jest.mocked(listNotifications);
const mockMarkAllRead = jest.mocked(markAllRead);
const mockGetOnboarding = jest.mocked(getOnboarding);
const mockAdvanceOnboarding = jest.mocked(advanceOnboarding);
const mockUseHouse = jest.mocked(useHouse);
const mockUseToast = jest.mocked(useToast);

const mockSetCurrentHouse = jest.fn();
const mockToast = jest.fn();

const house1: HouseSummary = { id: 'h1', name: 'Apto 42', role: 'admin', created_at: '' };

const invitation: Invitation = {
  id: 'inv1', house_id: 'h2', house_name: 'Casa B',
  invited_by_name: 'Carlos', status: 'pending', created_at: '',
};

const notification: AppNotification = {
  id: 'n1', type: 'task_completed',
  title: 'Tarefa concluída', body: 'Varrer sala foi concluída.',
  data: {}, is_read: false, created_at: new Date(Date.now() - 2 * 60000).toISOString(),
};

const onboardingActive: OnboardingStatus = { current_step: 0, total_steps: 4, completed: false };
const onboardingComplete: OnboardingStatus = { current_step: 3, total_steps: 4, completed: true };

beforeEach(() => {
  mockUseHouse.mockReturnValue({ currentHouse: null, setCurrentHouse: mockSetCurrentHouse });
  mockUseToast.mockReturnValue(mockToast);
  mockGetMyHouses.mockResolvedValue({ data: [house1] } as any);
  mockListInvitations.mockResolvedValue({ data: [] } as any);
  mockListNotifications.mockResolvedValue({ data: [] } as any);
  mockGetOnboarding.mockResolvedValue({ data: onboardingComplete } as any);
});

function renderHouses() {
  return render(<MemoryRouter><Houses /></MemoryRouter>);
}

describe('Houses page — house list', () => {
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

  it('sets current house and navigates to schedule on house card click', async () => {
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
});

describe('Houses page — create house modal', () => {
  it('opens create modal when "+ Nova casa" is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('+ Nova casa'));
    expect(screen.getByText('Criar nova casa')).toBeInTheDocument();
  });

  it('creates a house and shows success toast on form submit', async () => {
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

  it('closes create modal when Cancelar is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('+ Nova casa'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Criar nova casa')).not.toBeInTheDocument();
  });

  it('closes create modal when X button is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('+ Nova casa'));
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Criar nova casa')).not.toBeInTheDocument();
  });
});

describe('Houses page — join house modal', () => {
  it('opens join modal when "Entrar com código" is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('Entrar com código'));
    expect(screen.getByText('Entrar com código de convite')).toBeInTheDocument();
  });

  it('joins a house and shows success toast on form submit', async () => {
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

  it('closes join modal when Cancelar is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('Entrar com código'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Entrar com código de convite')).not.toBeInTheDocument();
  });

  it('closes join modal when X button is clicked', async () => {
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    fireEvent.click(screen.getByText('Entrar com código'));
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Entrar com código de convite')).not.toBeInTheDocument();
  });
});

describe('Houses page — invitations panel', () => {
  beforeEach(() => {
    mockListInvitations.mockResolvedValue({ data: [invitation] } as any);
  });

  it('shows invitations panel with house name and invited-by when invitations exist', async () => {
    renderHouses();
    await waitFor(() => expect(screen.getByText('Convites pendentes')).toBeInTheDocument());
    expect(screen.getByText('Casa B')).toBeInTheDocument();
    expect(screen.getByText('Convidado por Carlos')).toBeInTheDocument();
  });

  it('accepts invitation and shows success toast', async () => {
    mockAcceptInvitation.mockResolvedValue({ data: { message: 'Aceito!', house_id: 'h2', house_name: 'Casa B', role: 'resident' } } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Convites pendentes'));
    fireEvent.click(screen.getByRole('button', { name: 'Aceitar' }));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Aceito!', 'success'));
    expect(mockAcceptInvitation).toHaveBeenCalledWith('inv1');
  });

  it('shows error toast when accept invitation fails', async () => {
    mockAcceptInvitation.mockRejectedValue(new Error('Convite expirado'));
    renderHouses();
    await waitFor(() => screen.getByText('Convites pendentes'));
    fireEvent.click(screen.getByRole('button', { name: 'Aceitar' }));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Convite expirado', 'error'));
  });

  it('rejects invitation and shows success toast', async () => {
    mockRejectInvitation.mockResolvedValue({ data: { message: 'ok' } } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Convites pendentes'));
    fireEvent.click(screen.getByRole('button', { name: 'Recusar' }));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Convite recusado.', 'success'));
    expect(mockRejectInvitation).toHaveBeenCalledWith('inv1');
  });

  it('shows error toast when reject invitation fails', async () => {
    mockRejectInvitation.mockRejectedValue(new Error('Falha ao recusar'));
    renderHouses();
    await waitFor(() => screen.getByText('Convites pendentes'));
    fireEvent.click(screen.getByRole('button', { name: 'Recusar' }));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Falha ao recusar', 'error'));
  });

  it('does not show invitations panel when listInvitations fails gracefully', async () => {
    mockListInvitations.mockRejectedValue(new Error('network'));
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    expect(screen.queryByText('Convites pendentes')).not.toBeInTheDocument();
  });
});

describe('Houses page — notifications panel', () => {
  it('shows notifications panel with title and body when non-invitation notifications exist', async () => {
    mockListNotifications.mockResolvedValue({ data: [notification] } as any);
    renderHouses();
    await waitFor(() => expect(screen.getByText('Tarefa concluída')).toBeInTheDocument());
    expect(screen.getByText('Varrer sala foi concluída.')).toBeInTheDocument();
  });

  it('does not show notifications panel when all notifications are house_invitation type', async () => {
    const invNotif: AppNotification = { ...notification, type: 'house_invitation' };
    mockListNotifications.mockResolvedValue({ data: [invNotif] } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    expect(screen.queryByText('Notificações')).not.toBeInTheDocument();
  });

  it('shows unread badge count when there are unread notifications', async () => {
    mockListNotifications.mockResolvedValue({ data: [notification] } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Tarefa concluída'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows Marcar todas como lidas button when unread notifications exist', async () => {
    mockListNotifications.mockResolvedValue({ data: [notification] } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Marcar todas como lidas'));
  });

  it('marks all notifications as read and hides unread button', async () => {
    mockMarkAllRead.mockResolvedValue({ data: { message: 'ok' } } as any);
    mockListNotifications.mockResolvedValue({ data: [notification] } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Marcar todas como lidas'));
    fireEvent.click(screen.getByText('Marcar todas como lidas'));
    await waitFor(() => expect(screen.queryByText('Marcar todas como lidas')).not.toBeInTheDocument());
    expect(mockMarkAllRead).toHaveBeenCalled();
  });

  it('shows error toast when markAllRead fails', async () => {
    mockMarkAllRead.mockRejectedValue(new Error('Falha ao marcar'));
    mockListNotifications.mockResolvedValue({ data: [notification] } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Marcar todas como lidas'));
    fireEvent.click(screen.getByText('Marcar todas como lidas'));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Falha ao marcar', 'error'));
  });

  it('does not show notifications panel when listNotifications fails gracefully', async () => {
    mockListNotifications.mockRejectedValue(new Error('network'));
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    expect(screen.queryByText('Notificações')).not.toBeInTheDocument();
  });

  it('shows notification timestamp as "agora" for brand-new notifications', async () => {
    const freshNotif: AppNotification = { ...notification, created_at: new Date().toISOString() };
    mockListNotifications.mockResolvedValue({ data: [freshNotif] } as any);
    renderHouses();
    await waitFor(() => expect(screen.getByText('agora')).toBeInTheDocument());
  });

  it('shows notification timestamp in minutes for recent notifications', async () => {
    const recentNotif: AppNotification = {
      ...notification,
      created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    };
    mockListNotifications.mockResolvedValue({ data: [recentNotif] } as any);
    renderHouses();
    await waitFor(() => expect(screen.getByText('5min atrás')).toBeInTheDocument());
  });

  it('shows notification timestamp in hours for notifications from hours ago', async () => {
    const oldNotif: AppNotification = {
      ...notification,
      created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    };
    mockListNotifications.mockResolvedValue({ data: [oldNotif] } as any);
    renderHouses();
    await waitFor(() => expect(screen.getByText('3h atrás')).toBeInTheDocument());
  });

  it('shows notification timestamp in days for notifications from days ago', async () => {
    const oldNotif: AppNotification = {
      ...notification,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    };
    mockListNotifications.mockResolvedValue({ data: [oldNotif] } as any);
    renderHouses();
    await waitFor(() => expect(screen.getByText('2d atrás')).toBeInTheDocument());
  });
});

describe('Houses page — onboarding overlay', () => {
  it('shows onboarding overlay when onboarding is not completed', async () => {
    mockGetOnboarding.mockResolvedValue({ data: onboardingActive } as any);
    renderHouses();
    await waitFor(() => expect(screen.getByText('Bem-vindo ao Casa Comigo!')).toBeInTheDocument());
  });

  it('does not show onboarding overlay when onboarding is completed', async () => {
    mockGetOnboarding.mockResolvedValue({ data: onboardingComplete } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    expect(screen.queryByText('Bem-vindo ao Casa Comigo!')).not.toBeInTheDocument();
  });

  it('advances to next onboarding step when Próximo is clicked', async () => {
    const step1: OnboardingStatus = { current_step: 1, total_steps: 4, completed: false };
    mockGetOnboarding.mockResolvedValue({ data: onboardingActive } as any);
    mockAdvanceOnboarding.mockResolvedValue({ data: step1 } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Próximo'));
    fireEvent.click(screen.getByText('Próximo'));
    await waitFor(() => expect(screen.getByText('Sua casa, seus moradores')).toBeInTheDocument());
    expect(mockAdvanceOnboarding).toHaveBeenCalledTimes(1);
  });

  it('shows Começar button on last onboarding step', async () => {
    const lastStep: OnboardingStatus = { current_step: 3, total_steps: 4, completed: false };
    mockGetOnboarding.mockResolvedValue({ data: lastStep } as any);
    renderHouses();
    await waitFor(() => expect(screen.getByText('Começar')).toBeInTheDocument());
    expect(screen.getByText('Tudo pronto!')).toBeInTheDocument();
  });

  it('hides onboarding overlay when completed status returned from advanceOnboarding', async () => {
    mockGetOnboarding.mockResolvedValue({ data: { current_step: 3, total_steps: 4, completed: false } } as any);
    mockAdvanceOnboarding.mockResolvedValue({ data: { current_step: 3, total_steps: 4, completed: true } } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Começar'));
    fireEvent.click(screen.getByText('Começar'));
    await waitFor(() => expect(screen.queryByText('Tudo pronto!')).not.toBeInTheDocument());
  });

  it('silently handles advanceOnboarding failure and marks onboarding complete', async () => {
    mockGetOnboarding.mockResolvedValue({ data: onboardingActive } as any);
    mockAdvanceOnboarding.mockRejectedValue(new Error('network'));
    renderHouses();
    await waitFor(() => screen.getByText('Próximo'));
    fireEvent.click(screen.getByText('Próximo'));
    await waitFor(() => expect(screen.queryByText('Bem-vindo ao Casa Comigo!')).not.toBeInTheDocument());
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('does not show onboarding when getOnboarding fails gracefully', async () => {
    mockGetOnboarding.mockRejectedValue(new Error('network'));
    renderHouses();
    await waitFor(() => screen.getByText('Apto 42'));
    expect(screen.queryByText('Bem-vindo ao Casa Comigo!')).not.toBeInTheDocument();
  });

  it('shows onboarding dots indicating progress', async () => {
    mockGetOnboarding.mockResolvedValue({ data: onboardingActive } as any);
    renderHouses();
    await waitFor(() => screen.getByText('Bem-vindo ao Casa Comigo!'));
    const activeDot = document.querySelector('.onboarding-dot--active');
    expect(activeDot).toBeInTheDocument();
  });

  it('falls back to last ONBOARDING_STEPS entry when current_step is out of bounds', async () => {
    mockGetOnboarding.mockResolvedValue({
      data: { current_step: 99, total_steps: 4, completed: false },
    } as any);
    renderHouses();
    await waitFor(() => expect(document.querySelector('.onboarding-overlay')).toBeInTheDocument());
    // Component must not crash and must render some step content
    expect(document.querySelector('.onboarding-step__title')).toBeInTheDocument();
  });

  it('ignores second call to handleAdvanceOnboarding while already advancing (programmatic bypass)', async () => {
    let resolve: (v: unknown) => void;
    const neverSettles = new Promise((res) => { resolve = res; });
    mockGetOnboarding.mockResolvedValue({ data: onboardingActive } as any);
    mockAdvanceOnboarding.mockReturnValueOnce(neverSettles as any);
    renderHouses();
    await waitFor(() => screen.getByText('Próximo'));

    const btn = screen.getByRole('button', { name: 'Próximo' });
    fireEvent.click(btn); // first click — sets advancingOnboarding = true

    // Simulate programmatic call while advancing: remove disabled and click again
    btn.removeAttribute('disabled');
    fireEvent.click(btn); // hits the advancingOnboarding guard → returns early

    expect(mockAdvanceOnboarding).toHaveBeenCalledTimes(1);
  });
});
