import { useState, useEffect, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { getSchedule, completeTask, reportImpediment, reassignTask, distribute } from '../../api/schedule';
import { listMembers } from '../../api/members';
import { useHouse } from '../../contexts/HouseContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/UI/Toast';
import { Button } from '../../components/UI/Button';
import { Input, Select, Textarea } from '../../components/UI/Input';
import { Modal } from '../../components/UI/Modal';
import { Badge, statusLabel, statusVariant, effortLabel, effortVariant } from '../../components/UI/Badge';
import { PageSpinner } from '../../components/UI/Spinner';
import type { Assignment, Member, DistributionResult, ReassignConfirmation } from '../../types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

export function Schedule() {
  const { houseId } = useParams<{ houseId: string }>();
  const { currentHouse } = useHouse();
  const { user } = useAuth();
  const toast = useToast();

  const isAdmin = currentHouse?.role === 'admin';
  const isCatalogManager = currentHouse?.role === 'catalog_manager';

  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(nextMonth);
  const [filterMember, setFilterMember] = useState('');

  const [completeOpen, setCompleteOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<Assignment | null>(null);
  const [completeNotes, setCompleteNotes] = useState('');

  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignTarget, setReassignTarget] = useState<Assignment | null>(null);
  const [reassignTo, setReassignTo] = useState('');

  const [groupConfirm, setGroupConfirm] = useState<ReassignConfirmation | null>(null);

  const [distributeOpen, setDistributeOpen] = useState(false);
  const [distStart, setDistStart] = useState(today);
  const [distEnd, setDistEnd] = useState(nextMonth);
  const [distResult, setDistResult] = useState<DistributionResult | null>(null);
  const [distributing, setDistributing] = useState(false);

  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!houseId) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { date_from: dateFrom, date_to: dateTo };
      if (filterMember) params.assigned_to = filterMember;
      const [schedRes, membersRes] = await Promise.all([
        getSchedule(houseId, params),
        (isAdmin || isCatalogManager) ? listMembers(houseId) : Promise.resolve(null),
      ]);
      setAssignments(schedRes.data);
      if (membersRes) setMembers(membersRes.data);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [houseId, dateFrom, dateTo, filterMember]);

  const handleComplete = async (e: FormEvent) => {
    e.preventDefault();
    if (!houseId || !completeTarget) return;
    setSaving(true);
    try {
      await completeTask(houseId, completeTarget.id, completeNotes || undefined);
      toast('Tarefa concluída!', 'success');
      setCompleteOpen(false);
      setCompleteNotes('');
      fetchData();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImpediment = async (assignment: Assignment) => {
    if (!houseId) return;
    if (!confirm('Reportar impedimento e redistribuir esta tarefa?')) return;
    try {
      const { data } = await reportImpediment(houseId, assignment.id);
      toast(data.message, 'success');
      fetchData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleReassign = async (e: FormEvent) => {
    e.preventDefault();
    if (!houseId || !reassignTarget || !reassignTo) return;
    setSaving(true);
    try {
      const { data } = await reassignTask(houseId, reassignTarget.id, { assigned_to: reassignTo });
      if ('requires_confirmation' in data && data.requires_confirmation) {
        setGroupConfirm(data as ReassignConfirmation);
        setReassignOpen(false);
        return;
      }
      const result = data as Assignment & { warning?: string };
      if (result.warning) {
        toast(result.warning, 'warning');
      } else {
        toast('Tarefa reatribuída!', 'success');
      }
      setReassignOpen(false);
      fetchData();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleGroupConfirm = async (moveGroup: boolean) => {
    if (!houseId || !reassignTarget || !reassignTo) return;
    setSaving(true);
    try {
      const { data } = await reassignTask(houseId, reassignTarget.id, {
        assigned_to: reassignTo,
        force: true,
        move_group: moveGroup,
      });
      const result = data as Assignment & { warning?: string };
      if (result.warning) {
        toast(result.warning, 'warning');
      } else {
        toast('Tarefa reatribuída!', 'success');
      }
      setGroupConfirm(null);
      fetchData();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDistribute = async (e: FormEvent) => {
    e.preventDefault();
    if (!houseId) return;
    setDistributing(true);
    try {
      const { data } = await distribute(houseId, { period_start: distStart, period_end: distEnd });
      setDistResult(data);
      fetchData();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setDistributing(false);
    }
  };

  const grouped = assignments.reduce<Record<string, Assignment[]>>((acc, a) => {
    if (!acc[a.scheduled_date]) acc[a.scheduled_date] = [];
    acc[a.scheduled_date].push(a);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  if (loading) return <PageSpinner />;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Cronograma</h1>
          <p className="page__subtitle">{assignments.length} tarefas no período</p>
        </div>
        {isAdmin && (
          <Button onClick={() => { setDistResult(null); setDistributeOpen(true); }}>
            ⚡ Distribuir tarefas
          </Button>
        )}
      </div>

      <div className="page__toolbar schedule-filters">
        <Input
          id="date-from"
          label="De"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <Input
          id="date-to"
          label="Até"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        {(isAdmin || isCatalogManager) && members.length > 0 && (
          <Select
            id="filter-member"
            label="Morador"
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            options={[
              { value: '', label: 'Todos' },
              ...members.map((m) => ({ value: m.user_id, label: m.name })),
            ]}
          />
        )}
      </div>

      {sortedDates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📅</div>
          <p className="empty-state__text">Nenhuma tarefa neste período.</p>
          {isAdmin && (
            <p className="empty-state__hint">Use "Distribuir tarefas" para gerar o cronograma.</p>
          )}
        </div>
      ) : (
        <div className="schedule-timeline">
          {sortedDates.map((date) => (
            <div key={date} className="schedule-day">
              <div className="schedule-day__header">
                <span className="schedule-day__date">{formatDate(date)}</span>
                <span className="schedule-day__count">{grouped[date].length} tarefa{grouped[date].length !== 1 ? 's' : ''}</span>
              </div>
              <div className="schedule-day__tasks">
                {grouped[date].map((a) => (
                  <div key={a.id} className={`assignment-card assignment-card--${a.status}`}>
                    <div className="assignment-card__header">
                      <div className="assignment-card__name">{a.task_name}</div>
                      <Badge variant={statusVariant[a.status]}>{statusLabel[a.status]}</Badge>
                    </div>
                    <div className="assignment-card__meta">
                      {a.room && <span>🏠 {a.room}</span>}
                      <Badge variant={effortVariant[a.effort_level]}>{effortLabel[a.effort_level]}</Badge>
                      <span>⏱ {a.duration_minutes}min</span>
                      {(isAdmin || isCatalogManager) && (
                        <span className="assignment-card__assignee">👤 {a.assigned_to_name}</span>
                      )}
                    </div>
                    {a.completion_notes && (
                      <div className="assignment-card__notes">💬 {a.completion_notes}</div>
                    )}
                    {a.status === 'pending' && (
                      <div className="assignment-card__actions">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => { setCompleteTarget(a); setCompleteNotes(''); setCompleteOpen(true); }}
                        >
                          ✓ Concluir
                        </Button>
                        {a.assigned_to === user?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleImpediment(a)}
                          >
                            ⚠ Impedimento
                          </Button>
                        )}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setReassignTarget(a); setReassignTo(''); setReassignOpen(true); }}
                          >
                            ↩ Reatribuir
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Concluir tarefa"
        open={completeOpen}
        onClose={() => setCompleteOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCompleteOpen(false)}>Cancelar</Button>
            <Button form="complete-form" type="submit" loading={saving}>Confirmar</Button>
          </>
        }
      >
        <p className="modal-task-name">{completeTarget?.task_name}</p>
        <form id="complete-form" onSubmit={handleComplete}>
          <Textarea
            id="complete-notes"
            label="Observação (opcional)"
            value={completeNotes}
            onChange={(e) => setCompleteNotes(e.target.value)}
            placeholder="Ex: produto acabou, precisa de manutenção..."
            rows={3}
          />
        </form>
      </Modal>

      <Modal
        title="Reatribuir tarefa"
        open={reassignOpen}
        onClose={() => setReassignOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setReassignOpen(false)}>Cancelar</Button>
            <Button form="reassign-form" type="submit" loading={saving} disabled={!reassignTo}>
              Reatribuir
            </Button>
          </>
        }
      >
        <p className="modal-task-name">{reassignTarget?.task_name}</p>
        <form id="reassign-form" onSubmit={handleReassign}>
          <Select
            id="reassign-to"
            label="Novo responsável"
            value={reassignTo}
            onChange={(e) => setReassignTo(e.target.value)}
            options={[
              { value: '', label: 'Selecione...' },
              ...members.map((m) => ({ value: m.user_id, label: m.name })),
            ]}
          />
        </form>
      </Modal>

      <Modal
        title="Tarefa em grupo"
        open={!!groupConfirm}
        onClose={() => setGroupConfirm(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setGroupConfirm(null)}>Cancelar</Button>
          </>
        }
      >
        {groupConfirm && (
          <div className="group-confirm">
            <div className="group-confirm__warning">{groupConfirm.warning}</div>
            <p className="group-confirm__count">
              Este grupo contém <strong>{groupConfirm.group_task_count}</strong> tarefas.
            </p>
            <div className="group-confirm__actions">
              <Button
                variant="secondary"
                onClick={() => handleGroupConfirm(false)}
                loading={saving}
              >
                {groupConfirm.options.move_single}
              </Button>
              <Button
                onClick={() => handleGroupConfirm(true)}
                loading={saving}
              >
                {groupConfirm.options.move_group}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Distribuição automática"
        open={distributeOpen}
        onClose={() => { setDistributeOpen(false); setDistResult(null); }}
        footer={
          !distResult ? (
            <>
              <Button variant="ghost" onClick={() => setDistributeOpen(false)}>Cancelar</Button>
              <Button form="distribute-form" type="submit" loading={distributing}>
                Gerar distribuição
              </Button>
            </>
          ) : (
            <Button onClick={() => { setDistributeOpen(false); setDistResult(null); }}>
              Fechar
            </Button>
          )
        }
      >
        {!distResult ? (
          <form id="distribute-form" onSubmit={handleDistribute}>
            <p className="distribute-hint">
              Gera o cronograma automaticamente respeitando preferências, pesos e dependências.
            </p>
            <div className="form-row">
              <Input
                id="dist-start"
                label="Início do período"
                type="date"
                value={distStart}
                onChange={(e) => setDistStart(e.target.value)}
                required
              />
              <Input
                id="dist-end"
                label="Fim do período"
                type="date"
                value={distEnd}
                onChange={(e) => setDistEnd(e.target.value)}
                required
              />
            </div>
          </form>
        ) : (
          <div className="dist-result">
            <div className={`dist-result__status ${distResult.within_tolerance ? 'dist-result__status--ok' : 'dist-result__status--warn'}`}>
              {distResult.within_tolerance ? '✓ Dentro da tolerância' : '⚠ Fora da tolerância'}
            </div>
            <p className="dist-result__count">
              <strong>{distResult.total_tasks_assigned}</strong> tarefas distribuídas
            </p>
            <div className="dist-balance">
              {distResult.balance.map((b) => (
                <div key={b.user_id} className="dist-balance__item">
                  <div className="dist-balance__name">{b.name}</div>
                  <div className="dist-balance__bar-wrap">
                    <div
                      className={`dist-balance__bar ${b.within_tolerance ? '' : 'dist-balance__bar--warn'}`}
                      style={{ width: `${b.actual_percentage}%` }}
                    />
                  </div>
                  <div className="dist-balance__pct">
                    {b.actual_percentage.toFixed(1)}% <span className="dist-balance__target">(alvo: {b.target_percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
