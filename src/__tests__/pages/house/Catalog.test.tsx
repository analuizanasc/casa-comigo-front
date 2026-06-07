import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Catalog } from '../../../pages/house/Catalog';
import { listTasks, createTask, updateTask, deleteTask, getTask, addDependency, removeDependency } from '../../../api/catalog';
import { useToast } from '../../../components/UI/Toast';
import type { Task, TaskDetail } from '../../../types';

jest.mock('../../../api/catalog');
jest.mock('../../../components/UI/Toast');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ houseId: 'house-1' }),
}));

const mockListTasks = jest.mocked(listTasks);
const mockCreateTask = jest.mocked(createTask);
const mockUpdateTask = jest.mocked(updateTask);
const mockDeleteTask = jest.mocked(deleteTask);
const mockGetTask = jest.mocked(getTask);
const mockAddDependency = jest.mocked(addDependency);
const mockRemoveDependency = jest.mocked(removeDependency);
const mockUseToast = jest.mocked(useToast);
const mockToast = jest.fn();

const task1: Task = {
  id: 't1', house_id: 'house-1', name: 'Varrer sala', description: 'Varrer bem',
  frequency: 'weekly', duration_minutes: 30, effort_level: 'light',
  room: 'Sala', is_active: 1, created_by: 'u1', created_by_name: 'Alice',
  created_at: '', updated_at: '',
};
const task2: Task = {
  ...task1, id: 't2', name: 'Lavar louça', description: null,
  room: null, effort_level: 'medium', frequency: 'daily',
};
const taskDetail: TaskDetail = {
  ...task1,
  dependencies: [{ depends_on_task_id: 't2', depends_on_name: 'Lavar louça' }],
  dependents: [],
};
const taskDetailNoDeps: TaskDetail = { ...task1, dependencies: [], dependents: [] };

beforeEach(() => {
  mockUseToast.mockReturnValue(mockToast);
  mockListTasks.mockResolvedValue({ data: [task1, task2] } as any);
  mockCreateTask.mockResolvedValue({ data: taskDetail } as any);
  mockUpdateTask.mockResolvedValue({ data: taskDetail } as any);
  mockDeleteTask.mockResolvedValue({ data: { message: 'ok' } } as any);
  mockGetTask.mockResolvedValue({ data: taskDetail } as any);
  mockAddDependency.mockResolvedValue({ data: { message: 'ok' } } as any);
  mockRemoveDependency.mockResolvedValue({ data: { message: 'ok' } } as any);
});

function renderCatalog() {
  return render(<MemoryRouter><Catalog /></MemoryRouter>);
}

describe('Catalog page', () => {
  it('shows spinner while loading', () => {
    mockListTasks.mockReturnValue(new Promise(() => {}));
    renderCatalog();
    expect(document.querySelector('.page-spinner')).toBeInTheDocument();
  });

  it('renders task list after loading', async () => {
    renderCatalog();
    await waitFor(() => expect(screen.getByText('Varrer sala')).toBeInTheDocument());
    expect(screen.getByText('Varrer bem')).toBeInTheDocument();
    expect(screen.getByText(/Sala/)).toBeInTheDocument();
    // task2 has no description or room — just check name
    expect(screen.getByText('Lavar louça')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', async () => {
    mockListTasks.mockResolvedValue({ data: [] } as any);
    renderCatalog();
    await waitFor(() => expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeInTheDocument());
  });

  it('shows error toast when fetch fails', async () => {
    mockListTasks.mockRejectedValue(new Error('Erro ao carregar'));
    renderCatalog();
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro ao carregar', 'error'));
  });

  it('filters tasks by search term', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.change(screen.getByPlaceholderText('Buscar por nome ou cômodo...'), { target: { value: 'louça' } });
    expect(screen.queryByText('Varrer sala')).not.toBeInTheDocument();
    expect(screen.getByText('Lavar louça')).toBeInTheDocument();
  });

  it('shows empty state when search matches nothing', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.change(screen.getByPlaceholderText('Buscar por nome ou cômodo...'), { target: { value: 'zzznomatch' } });
    expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeInTheDocument();
  });

  it('opens create modal when "+ Nova tarefa" is clicked', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.click(screen.getByText('+ Nova tarefa'));
    expect(screen.getByText('Nova tarefa')).toBeInTheDocument();
  });

  it('creates a task on form submit', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getByText('+ Nova tarefa'));
    fireEvent.change(screen.getByLabelText('Nome da tarefa'), { target: { value: 'Nova Tarefa' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Tarefa criada!', 'success'));
    expect(mockCreateTask).toHaveBeenCalled();
  });

  it('shows error toast when create fails', async () => {
    mockCreateTask.mockRejectedValue(new Error('Falha'));
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getByText('+ Nova tarefa'));
    fireEvent.change(screen.getByLabelText('Nome da tarefa'), { target: { value: 'X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Falha', 'error'));
  });

  it('opens edit modal with task data and updates on submit', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0]);
    expect(screen.getByText('Editar tarefa')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Nome da tarefa'), { target: { value: 'Varrer Sala Atualizada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Tarefa atualizada!', 'success'));
    expect(mockUpdateTask).toHaveBeenCalled();
  });

  it('shows error toast when update fails', async () => {
    mockUpdateTask.mockRejectedValue(new Error('Update falhou'));
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Update falhou', 'error'));
  });

  it('deletes task when confirm is true', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Remover' })[0]);
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Tarefa removida.', 'success'));
    expect(mockDeleteTask).toHaveBeenCalled();
  });

  it('does NOT delete when confirm is cancelled', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Remover' })[0]);
    expect(mockDeleteTask).not.toHaveBeenCalled();
  });

  it('shows error toast when delete fails', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    mockDeleteTask.mockRejectedValue(new Error('Falha ao remover'));
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Remover' })[0]);
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Falha ao remover', 'error'));
  });

  it('opens dependencies modal with existing dependencies', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Dependências' })[0]);
    await waitFor(() => expect(screen.getByText('Lavar louça')).toBeInTheDocument());
  });

  it('shows empty dependency message when no dependencies', async () => {
    mockGetTask.mockResolvedValue({ data: taskDetailNoDeps } as any);
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Dependências' })[0]);
    await waitFor(() => expect(screen.getByText('Nenhuma dependência definida.')).toBeInTheDocument());
  });

  it('shows error toast when opening dependencies fails', async () => {
    mockGetTask.mockRejectedValue(new Error('Erro ao abrir'));
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Dependências' })[0]);
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro ao abrir', 'error'));
  });

  it('adds a dependency', async () => {
    mockGetTask
      .mockResolvedValueOnce({ data: taskDetailNoDeps } as any)
      .mockResolvedValueOnce({ data: taskDetailNoDeps } as any);

    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Dependências' })[0]);
    await waitFor(() => screen.getByText('Nenhuma dependência definida.'));

    // Select a dependency
    fireEvent.change(screen.getByLabelText('Adicionar dependência'), { target: { value: 't2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Dependência adicionada!', 'success'));
    expect(mockAddDependency).toHaveBeenCalledWith('house-1', 't1', 't2');
  });

  it('shows error toast when add dependency fails', async () => {
    mockGetTask.mockResolvedValue({ data: taskDetailNoDeps } as any);
    mockAddDependency.mockRejectedValue(new Error('Ciclo detectado'));

    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Dependências' })[0]);
    await waitFor(() => screen.getByText('Nenhuma dependência definida.'));

    fireEvent.change(screen.getByLabelText('Adicionar dependência'), { target: { value: 't2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Ciclo detectado', 'error'));
  });

  it('removes a dependency', async () => {
    mockGetTask
      .mockResolvedValueOnce({ data: taskDetail } as any)
      .mockResolvedValueOnce({ data: taskDetailNoDeps } as any);

    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Dependências' })[0]);
    await waitFor(() => screen.getByText('Lavar louça'));

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Remover' }));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Dependência removida.', 'success'));
    expect(mockRemoveDependency).toHaveBeenCalledWith('house-1', 't1', 't2');
  });

  it('shows error toast when remove dependency fails', async () => {
    mockGetTask.mockResolvedValue({ data: taskDetail } as any);
    mockRemoveDependency.mockRejectedValue(new Error('Erro ao remover dep'));

    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Dependências' })[0]);
    await waitFor(() => screen.getByText('Lavar louça'));

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Remover' }));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith('Erro ao remover dep', 'error'));
  });

  it('closes task form modal when "Cancelar" is clicked', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.click(screen.getByText('+ Nova tarefa'));
    expect(screen.getByText('Nova tarefa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Nova tarefa')).not.toBeInTheDocument();
  });

  it('closes task form modal when X button is clicked', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.click(screen.getByText('+ Nova tarefa'));
    expect(screen.getByText('Nova tarefa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText('Nova tarefa')).not.toBeInTheDocument();
  });

  it('updates all optional task form fields on change', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.click(screen.getByText('+ Nova tarefa'));

    fireEvent.change(screen.getByLabelText('Nome da tarefa'), { target: { value: 'Teste Campos' } });
    fireEvent.change(screen.getByLabelText('Descrição (opcional)'), { target: { value: 'Minha descrição' } });
    fireEvent.change(screen.getByLabelText('Frequência'), { target: { value: 'daily' } });
    fireEvent.change(screen.getByLabelText('Nível de esforço'), { target: { value: 'heavy' } });
    fireEvent.change(screen.getByLabelText('Duração (minutos)'), { target: { value: '60' } });
    fireEvent.change(screen.getByLabelText('Cômodo (opcional)'), { target: { value: 'Quarto' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar' }));

    await waitFor(() => expect(mockCreateTask).toHaveBeenCalledWith(
      'house-1',
      expect.objectContaining({
        description: 'Minha descrição',
        frequency: 'daily',
        effort_level: 'heavy',
        duration_minutes: 60,
        room: 'Quarto',
      })
    ));
  });

  it('closes dep modal when X button is clicked', async () => {
    renderCatalog();
    await waitFor(() => screen.getByText('Varrer sala'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Dependências' })[0]);
    await waitFor(() => screen.getByText('Lavar louça'));
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
