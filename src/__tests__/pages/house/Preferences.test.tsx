import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Preferences } from '../../../pages/house/Preferences';
import { listPreferences, setPreference } from '../../../api/preferences';
import { useToast } from '../../../components/UI/Toast';
import type { Preference } from '../../../types';

jest.mock('../../../api/preferences');
jest.mock('../../../components/UI/Toast');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ houseId: 'house-1' }),
}));

const mockListPreferences = jest.mocked(listPreferences);
const mockSetPreference = jest.mocked(setPreference);
const mockUseToast = jest.mocked(useToast);
const mockToast = jest.fn();

const pref1: Preference = {
  task_id: 't1', task_name: 'Varrer sala', room: 'Sala',
  effort_level: 'light', preference_level: 'neutral', has_physical_limitation: false,
};
const pref2: Preference = {
  task_id: 't2', task_name: 'Lavar louça', room: null,
  effort_level: 'heavy', preference_level: 'hate', has_physical_limitation: true,
};

beforeEach(() => {
  mockUseToast.mockReturnValue(mockToast);
  mockListPreferences.mockResolvedValue({ data: [pref1, pref2] } as any);
  mockSetPreference.mockResolvedValue({} as any);
});

function renderPreferences() {
  return render(<MemoryRouter><Preferences /></MemoryRouter>);
}

describe('Preferences page', () => {
  it('shows spinner while loading', () => {
    mockListPreferences.mockReturnValue(new Promise(() => {}));
    renderPreferences();
    expect(document.querySelector('.page-spinner')).toBeInTheDocument();
  });

  it('renders preferences after loading', async () => {
    renderPreferences();
    await waitFor(() => expect(screen.getByText('Varrer sala')).toBeInTheDocument());
    expect(screen.getByText(/Sala/)).toBeInTheDocument();
    expect(screen.getByText('Lavar louça')).toBeInTheDocument();
  });

  it('shows error toast when fetch fails', async () => {
    mockListPreferences.mockRejectedValue(new Error('Erro ao carregar'));
    renderPreferences();
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro ao carregar', 'error'));
  });

  it('shows empty state when no preferences', async () => {
    mockListPreferences.mockResolvedValue({ data: [] } as any);
    renderPreferences();
    await waitFor(() => expect(screen.getByText('Nenhuma tarefa no catálogo ainda.')).toBeInTheDocument());
  });

  it('filters preferences by search term', async () => {
    renderPreferences();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.change(screen.getByPlaceholderText('Buscar tarefa ou cômodo...'), { target: { value: 'louça' } });
    expect(screen.queryByText('Varrer sala')).not.toBeInTheDocument();
    expect(screen.getByText('Lavar louça')).toBeInTheDocument();
  });

  it('shows empty state when search matches nothing', async () => {
    renderPreferences();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.change(screen.getByPlaceholderText('Buscar tarefa ou cômodo...'), { target: { value: 'zzz' } });
    expect(screen.getByText('Nenhuma tarefa no catálogo ainda.')).toBeInTheDocument();
  });

  it('marks pref-card--limited when has_physical_limitation is true', async () => {
    renderPreferences();
    await waitFor(() => screen.getByText('Lavar louça'));
    const cards = document.querySelectorAll('.pref-card');
    const limitedCard = Array.from(cards).find(c => c.classList.contains('pref-card--limited'));
    expect(limitedCard).toBeInTheDocument();
  });

  it('updates preference level when toggle button is clicked', async () => {
    renderPreferences();
    await waitFor(() => screen.getByText('Varrer sala'));

    // Click 👍 (like) for pref1 (currently 'neutral')
    const likeButtons = screen.getAllByTitle('Gosto');
    fireEvent.click(likeButtons[0]);

    await waitFor(() =>
      expect(mockSetPreference).toHaveBeenCalledWith('house-1', 't1', {
        preference_level: 'like',
        has_physical_limitation: false,
      })
    );
  });

  it('shows error toast when preference update fails', async () => {
    mockSetPreference.mockRejectedValue(new Error('Falha ao salvar'));
    renderPreferences();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getAllByTitle('Gosto')[0]);
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Falha ao salvar', 'error'));
  });

  it('toggles physical limitation checkbox', async () => {
    renderPreferences();
    await waitFor(() => screen.getByText('Varrer sala'));

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() =>
      expect(mockSetPreference).toHaveBeenCalledWith('house-1', 't1', {
        preference_level: 'neutral',
        has_physical_limitation: true,
      })
    );
  });

  it('shows error toast when physical limitation update fails', async () => {
    mockSetPreference.mockRejectedValue(new Error('Erro limitação'));
    renderPreferences();
    await waitFor(() => screen.getByText('Varrer sala'));

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro limitação', 'error'));
  });

  it('disables toggle buttons while an update is in progress', async () => {
    mockSetPreference.mockReturnValue(new Promise(() => {}));
    renderPreferences();
    await waitFor(() => screen.getByText('Varrer sala'));

    const likeButtons = screen.getAllByTitle('Gosto');
    fireEvent.click(likeButtons[0]);

    await waitFor(() => {
      expect(likeButtons[0]).toBeDisabled();
    });
  });
});
