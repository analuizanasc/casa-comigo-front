import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Reports } from '../../../pages/house/Reports';
import { getPerformanceReport, getBalanceReport, getMyPerformance } from '../../../api/reports';
import { useHouse } from '../../../contexts/HouseContext';
import { useToast } from '../../../components/UI/Toast';
import type { PerformanceReport, BalanceReport, MyPerformanceReport, HouseSummary } from '../../../types';

jest.mock('../../../api/reports');
jest.mock('../../../contexts/HouseContext');
jest.mock('../../../components/UI/Toast');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ houseId: 'house-1' }),
}));

const mockGetPerformanceReport = jest.mocked(getPerformanceReport);
const mockGetBalanceReport = jest.mocked(getBalanceReport);
const mockGetMyPerformance = jest.mocked(getMyPerformance);
const mockUseHouse = jest.mocked(useHouse);
const mockUseToast = jest.mocked(useToast);
const mockToast = jest.fn();

const adminHouse: HouseSummary = { id: 'house-1', name: 'Casa', role: 'admin', created_at: '' };
const residentHouse: HouseSummary = { id: 'house-1', name: 'Casa', role: 'resident', created_at: '' };

const balanceOk: BalanceReport = {
  using_equal_distribution: false,
  tolerance_percentage: 10,
  within_tolerance: true,
  members: [
    { user_id: 'u1', name: 'Alice', target_percentage: 50, actual_percentage: 52, deviation: 2, within_tolerance: true },
  ],
};
const balanceWarn: BalanceReport = {
  ...balanceOk,
  within_tolerance: false,
  using_equal_distribution: true,
  members: [
    { user_id: 'u1', name: 'Alice', target_percentage: 50, actual_percentage: 70, deviation: 20, within_tolerance: false },
  ],
};

function makePerf(completion_rate: number): PerformanceReport {
  return {
    period: { from: '2024-01-01', to: '2024-01-31' },
    members: [{
      user_id: 'u1', name: 'Alice', role: 'resident',
      weight_percentage: null, total_assigned: 10,
      completed: 8, overdue: 1, redistributed: 0, pending: 1,
      completion_rate,
    }],
  };
}

const myPerf: MyPerformanceReport = {
  period: { from: '2024-01-01', to: '2024-01-31' },
  user_id: 'u1', name: 'Alice', role: 'resident',
  weight_percentage: null, total_assigned: 5,
  completed: 4, overdue: 0, redistributed: 0, pending: 1,
  completion_rate: 80,
};

function setupAdmin() {
  mockUseHouse.mockReturnValue({ currentHouse: adminHouse, setCurrentHouse: jest.fn() });
  mockUseToast.mockReturnValue(mockToast);
  mockGetPerformanceReport.mockResolvedValue({ data: makePerf(80) } as any);
  mockGetBalanceReport.mockResolvedValue({ data: balanceOk } as any);
}

function setupResident() {
  mockUseHouse.mockReturnValue({ currentHouse: residentHouse, setCurrentHouse: jest.fn() });
  mockUseToast.mockReturnValue(mockToast);
  mockGetMyPerformance.mockResolvedValue({ data: myPerf } as any);
}

function renderReports() {
  return render(<MemoryRouter><Reports /></MemoryRouter>);
}

describe('Reports page — admin view', () => {
  beforeEach(() => setupAdmin());

  it('shows spinner while loading', () => {
    mockGetPerformanceReport.mockReturnValue(new Promise(() => {}));
    renderReports();
    expect(document.querySelector('.page-spinner')).toBeInTheDocument();
  });

  it('renders balance and performance sections after loading', async () => {
    renderReports();
    await waitFor(() => expect(screen.getByText('Balanceamento de Esforço')).toBeInTheDocument());
    expect(screen.getByText('Desempenho por Morador')).toBeInTheDocument();
  });

  it('shows Dentro da tolerância badge with tolerance value for balance ok', async () => {
    renderReports();
    await waitFor(() => screen.getByText('Balanceamento de Esforço'));
    const status = screen.getByText(/Dentro da tolerância/);
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('±10pp');
  });

  it('shows Fora da tolerância and Distribuição igualitária badge for balance warn', async () => {
    mockGetBalanceReport.mockResolvedValue({ data: balanceWarn } as any);
    renderReports();
    await waitFor(() => screen.getByText('Balanceamento de Esforço'));
    expect(screen.getByText(/Fora da tolerância/)).toBeInTheDocument();
    expect(screen.getByText('Distribuição igualitária')).toBeInTheDocument();
  });

  it('applies balance-bar__fill--warn class when member is out of tolerance', async () => {
    mockGetBalanceReport.mockResolvedValue({ data: balanceWarn } as any);
    renderReports();
    await waitFor(() => screen.getByText('Balanceamento de Esforço'));
    expect(document.querySelector('.balance-bar__fill--warn')).toBeInTheDocument();
  });

  it('applies balance-bar__fill--ok class when member is within tolerance', async () => {
    renderReports();
    await waitFor(() => screen.getByText('Balanceamento de Esforço'));
    expect(document.querySelector('.balance-bar__fill--ok')).toBeInTheDocument();
  });

  it('shows member name and total assigned count in performance card', async () => {
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    expect(screen.getByText('10 tarefas atribuídas')).toBeInTheDocument();
  });

  it('renders CompletionRing with green stroke for completion rate >= 80', async () => {
    mockGetPerformanceReport.mockResolvedValue({ data: makePerf(80) } as any);
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    const circles = document.querySelector('.ring')!.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#4A7C59');
  });

  it('renders CompletionRing with yellow stroke for 50 <= rate < 80', async () => {
    mockGetPerformanceReport.mockResolvedValue({ data: makePerf(65) } as any);
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    const circles = document.querySelector('.ring')!.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#C09030');
  });

  it('renders CompletionRing with red stroke for rate < 50', async () => {
    mockGetPerformanceReport.mockResolvedValue({ data: makePerf(30) } as any);
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    const circles = document.querySelector('.ring')!.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#B54848');
  });

  it('shows positive deviation with + sign', async () => {
    renderReports();
    await waitFor(() => screen.getByText(/Desvio:/));
    expect(screen.getByText(/\+2\.0pp/)).toBeInTheDocument();
  });

  it('shows negative deviation without + sign', async () => {
    mockGetBalanceReport.mockResolvedValue({
      data: { ...balanceOk, members: [{ ...balanceOk.members[0], deviation: -2 }] },
    } as any);
    renderReports();
    await waitFor(() => screen.getByText(/Desvio:/));
    expect(screen.getByText(/-2\.0pp/)).toBeInTheDocument();
  });

  it('shows error toast when fetch fails', async () => {
    mockGetPerformanceReport.mockRejectedValue(new Error('Erro nos relatórios'));
    renderReports();
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro nos relatórios', 'error'));
  });

  it('refetches performance when De date filter changes', async () => {
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    fireEvent.change(screen.getByLabelText('De'), { target: { value: '2024-02-01' } });
    await waitFor(() => expect(mockGetPerformanceReport).toHaveBeenCalledTimes(2));
  });

  it('refetches performance when Até date filter changes', async () => {
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    fireEvent.change(screen.getByLabelText('Até'), { target: { value: '2024-02-28' } });
    await waitFor(() => expect(mockGetPerformanceReport).toHaveBeenCalledTimes(2));
  });

  it('shows subtitle Desempenho e balanceamento da casa for admin', async () => {
    renderReports();
    await waitFor(() => screen.getByText('Balanceamento de Esforço'));
    expect(screen.getByText('Desempenho e balanceamento da casa')).toBeInTheDocument();
  });
});

describe('Reports page — resident (non-admin) view', () => {
  beforeEach(() => setupResident());

  it('shows spinner while loading for resident', () => {
    mockGetMyPerformance.mockReturnValue(new Promise(() => {}));
    renderReports();
    expect(document.querySelector('.page-spinner')).toBeInTheDocument();
  });

  it('renders Meu Desempenho section for non-admin user', async () => {
    renderReports();
    await waitFor(() => expect(screen.getByText('Meu Desempenho')).toBeInTheDocument());
  });

  it('does not render balance or admin performance sections for resident', async () => {
    renderReports();
    await waitFor(() => screen.getByText('Meu Desempenho'));
    expect(screen.queryByText('Balanceamento de Esforço')).not.toBeInTheDocument();
    expect(screen.queryByText('Desempenho por Morador')).not.toBeInTheDocument();
  });

  it('shows subtitle Meu desempenho for non-admin', async () => {
    renderReports();
    await waitFor(() => screen.getByText('Meu Desempenho'));
    expect(screen.getByText('Meu desempenho')).toBeInTheDocument();
  });

  it('shows Alice performance stats in resident view', async () => {
    renderReports();
    await waitFor(() => screen.getByText('Meu Desempenho'));
    expect(screen.getByText('5 tarefas atribuídas')).toBeInTheDocument();
  });

  it('shows error toast when getMyPerformance fails', async () => {
    mockGetMyPerformance.mockRejectedValue(new Error('Erro meu desempenho'));
    renderReports();
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro meu desempenho', 'error'));
  });

  it('refetches when date filter changes for resident', async () => {
    renderReports();
    await waitFor(() => screen.getByText('Meu Desempenho'));
    fireEvent.change(screen.getByLabelText('De'), { target: { value: '2024-02-01' } });
    await waitFor(() => expect(mockGetMyPerformance).toHaveBeenCalledTimes(2));
  });
});
