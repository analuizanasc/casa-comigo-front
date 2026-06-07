import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Reports } from '../../../pages/house/Reports';
import { getPerformanceReport, getBalanceReport } from '../../../api/reports';
import { useToast } from '../../../components/UI/Toast';
import type { PerformanceReport, BalanceReport } from '../../../types';

jest.mock('../../../api/reports');
jest.mock('../../../components/UI/Toast');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ houseId: 'house-1' }),
}));

const mockGetPerformanceReport = jest.mocked(getPerformanceReport);
const mockGetBalanceReport = jest.mocked(getBalanceReport);
const mockUseToast = jest.mocked(useToast);
const mockToast = jest.fn();

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

beforeEach(() => {
  mockUseToast.mockReturnValue(mockToast);
  mockGetPerformanceReport.mockResolvedValue({ data: makePerf(80) } as any);
  mockGetBalanceReport.mockResolvedValue({ data: balanceOk } as any);
});

function renderReports() {
  return render(<MemoryRouter><Reports /></MemoryRouter>);
}

describe('Reports page', () => {
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

  it('shows within tolerance badge and correct icon for balance ok', async () => {
    renderReports();
    await waitFor(() => screen.getByText('Balanceamento de Esforço'));
    const status = screen.getByText(/Dentro da tolerância/);
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('±10pp');
  });

  it('shows out of tolerance warning and equal distribution badge', async () => {
    mockGetBalanceReport.mockResolvedValue({ data: balanceWarn } as any);
    renderReports();
    await waitFor(() => screen.getByText('Balanceamento de Esforço'));
    expect(screen.getByText(/Fora da tolerância/)).toBeInTheDocument();
    expect(screen.getByText('Distribuição igualitária')).toBeInTheDocument();
  });

  it('shows warn class on balance bar when member is out of tolerance', async () => {
    mockGetBalanceReport.mockResolvedValue({ data: balanceWarn } as any);
    renderReports();
    await waitFor(() => screen.getByText('Balanceamento de Esforço'));
    expect(document.querySelector('.balance-bar__fill--warn')).toBeInTheDocument();
  });

  it('shows member name and total assigned in performance card', async () => {
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    expect(screen.getByText('10 tarefas atribuídas')).toBeInTheDocument();
  });

  it('renders CompletionRing with green color for rate >= 80', async () => {
    mockGetPerformanceReport.mockResolvedValue({ data: makePerf(80) } as any);
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    const ring = document.querySelector('.ring');
    expect(ring).toBeInTheDocument();
    // Green stroke
    const circles = ring!.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#4A7C59');
  });

  it('renders CompletionRing with yellow color for 50 <= rate < 80', async () => {
    mockGetPerformanceReport.mockResolvedValue({ data: makePerf(65) } as any);
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    const circles = document.querySelector('.ring')!.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#C09030');
  });

  it('renders CompletionRing with red color for rate < 50', async () => {
    mockGetPerformanceReport.mockResolvedValue({ data: makePerf(30) } as any);
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));
    const circles = document.querySelector('.ring')!.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#B54848');
  });

  it('shows deviation with + sign when positive', async () => {
    renderReports();
    await waitFor(() => screen.getByText(/Desvio:/));
    expect(screen.getByText(/\+2\.0pp/)).toBeInTheDocument();
  });

  it('shows deviation without + sign when negative or zero', async () => {
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

  it('refetches when date filter changes', async () => {
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));

    fireEvent.change(screen.getByLabelText('De'), { target: { value: '2024-02-01' } });

    await waitFor(() => expect(mockGetPerformanceReport).toHaveBeenCalledTimes(2));
  });

  it('refetches when "Até" date filter changes', async () => {
    renderReports();
    await waitFor(() => screen.getAllByText('Alice'));

    fireEvent.change(screen.getByLabelText('Até'), { target: { value: '2024-02-28' } });

    await waitFor(() => expect(mockGetPerformanceReport).toHaveBeenCalledTimes(2));
  });
});
