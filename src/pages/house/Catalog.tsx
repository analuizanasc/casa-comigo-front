import { useState, useEffect, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  getTask,
  addDependency,
  removeDependency,
} from '../../api/catalog';
import { useToast } from '../../components/UI/Toast';
import { Button } from '../../components/UI/Button';
import { Input, Select, Textarea } from '../../components/UI/Input';
import { Modal } from '../../components/UI/Modal';
import { Badge, effortLabel, effortVariant, frequencyLabel } from '../../components/UI/Badge';
import { PageSpinner } from '../../components/UI/Spinner';
import type { Task, TaskDetail, EffortLevel, Frequency } from '../../types';

const frequencyOptions = [
  { value: 'daily', label: 'Diária' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quinzenal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'annual', label: 'Anual' },
];

const effortOptions = [
  { value: 'light', label: 'Leve' },
  { value: 'medium', label: 'Médio' },
  { value: 'heavy', label: 'Pesado' },
];

const emptyForm = {
  name: '',
  description: '',
  frequency: 'weekly' as Frequency,
  duration_minutes: '30',
  effort_level: 'medium' as EffortLevel,
  room: '',
};

export function Catalog() {
  const { houseId } = useParams<{ houseId: string }>();
  const toast = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const [depTask, setDepTask] = useState<TaskDetail | null>(null);
  const [depOpen, setDepOpen] = useState(false);
  const [depTarget, setDepTarget] = useState('');

  const fetchTasks = async () => {
    if (!houseId) return;
    try {
      const { data } = await listTasks(houseId);
      setTasks(data);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [houseId]);

  const openCreate = () => {
    setEditingTask(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      name: task.name,
      description: task.description ?? '',
      frequency: task.frequency,
      duration_minutes: task.duration_minutes.toString(),
      effort_level: task.effort_level,
      room: task.room ?? '',
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!houseId) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        frequency: form.frequency,
        duration_minutes: parseInt(form.duration_minutes),
        effort_level: form.effort_level,
        room: form.room || undefined,
      };
      if (editingTask) {
        await updateTask(houseId, editingTask.id, payload);
        toast('Tarefa atualizada!', 'success');
      } else {
        await createTask(houseId, payload);
        toast('Tarefa criada!', 'success');
      }
      setFormOpen(false);
      fetchTasks();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task: Task) => {
    if (!houseId) return;
    if (!confirm(`Remover "${task.name}" do catálogo?`)) return;
    try {
      await deleteTask(houseId, task.id);
      toast('Tarefa removida.', 'success');
      fetchTasks();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const openDependencies = async (task: Task) => {
    if (!houseId) return;
    try {
      const { data } = await getTask(houseId, task.id);
      setDepTask(data);
      setDepTarget('');
      setDepOpen(true);
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleAddDep = async (e: FormEvent) => {
    e.preventDefault();
    if (!houseId || !depTask || !depTarget) return;
    setSaving(true);
    try {
      await addDependency(houseId, depTask.id, depTarget);
      toast('Dependência adicionada!', 'success');
      const { data } = await getTask(houseId, depTask.id);
      setDepTask(data);
      setDepTarget('');
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDep = async (dependsOnId: string) => {
    if (!houseId || !depTask) return;
    try {
      await removeDependency(houseId, depTask.id, dependsOnId);
      toast('Dependência removida.', 'success');
      const { data } = await getTask(houseId, depTask.id);
      setDepTask(data);
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const filtered = tasks.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.room ?? '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageSpinner />;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Catálogo de Tarefas</h1>
          <p className="page__subtitle">{tasks.length} tarefas cadastradas</p>
        </div>
        <Button onClick={openCreate}>+ Nova tarefa</Button>
      </div>

      <div className="page__toolbar">
        <input
          className="search-input"
          placeholder="Buscar por nome ou cômodo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <p className="empty-state__text">Nenhuma tarefa encontrada.</p>
        </div>
      ) : (
        <div className="task-grid">
          {filtered.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-card__header">
                <div className="task-card__name">{task.name}</div>
                <Badge variant={effortVariant[task.effort_level]}>
                  {effortLabel[task.effort_level]}
                </Badge>
              </div>
              {task.room && (
                <div className="task-card__room">🏠 {task.room}</div>
              )}
              {task.description && (
                <div className="task-card__desc">{task.description}</div>
              )}
              <div className="task-card__meta">
                <span className="task-card__freq">{frequencyLabel[task.frequency]}</span>
                <span className="task-card__duration">⏱ {task.duration_minutes}min</span>
              </div>
              <div className="task-card__actions">
                <Button variant="ghost" size="sm" onClick={() => openDependencies(task)}>
                  Dependências
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(task)}>Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(task)} style={{ color: 'var(--danger)' }}>
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editingTask ? 'Editar tarefa' : 'Nova tarefa'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button form="task-form" type="submit" loading={saving}>
              {editingTask ? 'Salvar' : 'Criar'}
            </Button>
          </>
        }
      >
        <form id="task-form" onSubmit={handleSubmit}>
          <Input
            id="task-name"
            label="Nome da tarefa"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Varrer a sala"
            required
            autoFocus
          />
          <Textarea
            id="task-desc"
            label="Descrição (opcional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Detalhes sobre a tarefa"
            rows={2}
          />
          <div className="form-row">
            <Select
              id="task-freq"
              label="Frequência"
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value as Frequency })}
              options={frequencyOptions}
            />
            <Select
              id="task-effort"
              label="Nível de esforço"
              value={form.effort_level}
              onChange={(e) => setForm({ ...form, effort_level: e.target.value as EffortLevel })}
              options={effortOptions}
            />
          </div>
          <div className="form-row">
            <Input
              id="task-duration"
              label="Duração (minutos)"
              type="number"
              min="1"
              value={form.duration_minutes}
              onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
            />
            <Input
              id="task-room"
              label="Cômodo (opcional)"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              placeholder="Ex: Sala, Cozinha"
            />
          </div>
        </form>
      </Modal>

      <Modal
        title={`Dependências — ${depTask?.name}`}
        open={depOpen}
        onClose={() => setDepOpen(false)}
      >
        {depTask && (
          <div>
            <p className="dep-hint">
              Esta tarefa deve ser executada <strong>após</strong> as tarefas abaixo:
            </p>
            {depTask.dependencies.length === 0 ? (
              <p className="dep-empty">Nenhuma dependência definida.</p>
            ) : (
              <ul className="dep-list">
                {depTask.dependencies.map((d) => (
                  <li key={d.depends_on_task_id} className="dep-item">
                    <span>{d.depends_on_name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDep(d.depends_on_task_id)}
                      style={{ color: 'var(--danger)' }}
                    >
                      Remover
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleAddDep} className="dep-form">
              <Select
                id="dep-target"
                label="Adicionar dependência"
                value={depTarget}
                onChange={(e) => setDepTarget(e.target.value)}
                options={[
                  { value: '', label: 'Selecione uma tarefa...' },
                  ...tasks
                    .filter((t) =>
                      t.id !== depTask.id &&
                      !depTask.dependencies.some((d) => d.depends_on_task_id === t.id)
                    )
                    .map((t) => ({ value: t.id, label: t.name })),
                ]}
              />
              <Button type="submit" loading={saving} disabled={!depTarget} size="sm">
                Adicionar
              </Button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
