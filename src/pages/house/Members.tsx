import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  listMembers,
  inviteMember,
  updateRole,
  updateWeight,
  updateAvailability,
  removeMember,
  getWeights,
} from '../../api/members';
import { useHouse } from '../../contexts/HouseContext';
import { useToast } from '../../components/UI/Toast';
import { Button } from '../../components/UI/Button';
import { Input, Select } from '../../components/UI/Input';
import { Modal } from '../../components/UI/Modal';
import { Badge, roleLabel } from '../../components/UI/Badge';
import { PageSpinner } from '../../components/UI/Spinner';
import type { Member, Role, WeightsSummary } from '../../types';

export function Members() {
  const { houseId } = useParams<{ houseId: string }>();
  const { currentHouse } = useHouse();
  const toast = useToast();

  const [members, setMembers] = useState<Member[]>([]);
  const [weights, setWeights] = useState<WeightsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editRole, setEditRole] = useState<Role>('resident');
  const [editWeight, setEditWeight] = useState('');
  const [editAvailability, setEditAvailability] = useState('');

  const isAdmin = currentHouse?.role === 'admin';

  const fetchData = useCallback(async () => {
    if (!houseId) return;
    try {
      const [membersRes, weightsRes] = await Promise.all([
        listMembers(houseId),
        isAdmin ? getWeights(houseId) : Promise.resolve(null),
      ]);
      setMembers(membersRes.data);
      if (weightsRes) setWeights(weightsRes.data);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Ocorreu um erro.', 'error');
    } finally {
      setLoading(false);
    }
  }, [houseId, isAdmin, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    if (!houseId) return;
    setSaving(true);
    try {
      await inviteMember(houseId, inviteEmail);
      toast('Convite enviado! O usuário verá a notificação na tela inicial.', 'success');
      setInviteOpen(false);
      setInviteEmail('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Ocorreu um erro.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (member: Member) => {
    setEditMember(member);
    setEditRole(member.role);
    setEditWeight(member.weight_percentage?.toString() ?? '');
    setEditAvailability(member.weekly_availability_hours?.toString() ?? '');
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!houseId || !editMember) return;
    setSaving(true);
    try {
      const promises: Promise<unknown>[] = [];

      if (editRole !== editMember.role) {
        promises.push(updateRole(houseId, editMember.user_id, editRole));
      }
      if (editWeight !== '' && editWeight !== editMember.weight_percentage?.toString()) {
        promises.push(updateWeight(houseId, editMember.user_id, parseFloat(editWeight)));
      }
      if (editAvailability !== '' && editAvailability !== editMember.weekly_availability_hours?.toString()) {
        promises.push(updateAvailability(houseId, editMember.user_id, parseFloat(editAvailability)));
      }

      await Promise.all(promises);
      toast('Membro atualizado!', 'success');
      setEditMember(null);
      fetchData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Ocorreu um erro.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (member: Member) => {
    if (!houseId) return;
    if (!confirm(`Remover ${member.name} da casa?`)) return;
    try {
      await removeMember(houseId, member.user_id);
      toast('Membro removido.', 'success');
      fetchData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Ocorreu um erro.', 'error');
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Membros</h1>
          <p className="page__subtitle">{members.length} membros na casa</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setInviteOpen(true)}>+ Convidar membro</Button>
        )}
      </div>

      {isAdmin && weights && (
        <div className="weights-panel">
          <div className="weights-panel__header">
            <h2 className="weights-panel__title">Distribuição de Carga</h2>
            <div className="weights-panel__meta">
              {weights.using_equal_distribution ? (
                <Badge variant="pendente">Distribuição igualitária</Badge>
              ) : weights.is_valid ? (
                <Badge variant="concluida">Pesos válidos — {weights.total_defined_weight}%</Badge>
              ) : (
                <Badge variant="impedida">Incompleto — {weights.total_defined_weight}% definido</Badge>
              )}
            </div>
          </div>
          <div className="weights-bars">
            {weights.members.map((m) => (
              <div key={m.user_id} className="weight-bar">
                <div className="weight-bar__label">
                  <span>{m.name}</span>
                  <span className="weight-bar__pct">{m.effective_weight.toFixed(1)}%</span>
                </div>
                <div className="weight-bar__track">
                  <div
                    className="weight-bar__fill"
                    style={{ width: `${m.effective_weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="members-list">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <div className="member-card__avatar">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div className="member-card__info">
              <div className="member-card__name">{member.name}</div>
              <div className="member-card__email">{member.email}</div>
              <div className="member-card__meta">
                <Badge variant={member.role === 'admin' ? 'barro' : member.role === 'catalog_manager' ? 'leve' : 'default'}>
                  {roleLabel[member.role]}
                </Badge>
                {member.weight_percentage !== null && (
                  <span className="member-card__weight">⚖ {member.weight_percentage}%</span>
                )}
                {member.weekly_availability_hours > 0 && (
                  <span className="member-card__avail">🕐 {member.weekly_availability_hours}h/sem</span>
                )}
              </div>
            </div>
            {isAdmin && (
              <div className="member-card__actions">
                <Button variant="ghost" size="sm" onClick={() => openEdit(member)}>Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(member)} style={{ color: 'var(--vermelho)' }}>Remover</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        title="Convidar membro"
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancelar</Button>
            <Button form="invite-form" type="submit" loading={saving}>Convidar</Button>
          </>
        }
      >
        <form id="invite-form" onSubmit={handleInvite}>
          <Input
            id="invite-email"
            label="E-mail do morador"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="morador@email.com"
            required
            autoFocus
          />
        </form>
      </Modal>

      <Modal
        title={`Editar — ${editMember?.name}`}
        open={!!editMember}
        onClose={() => setEditMember(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditMember(null)}>Cancelar</Button>
            <Button form="edit-member-form" type="submit" loading={saving}>Salvar</Button>
          </>
        }
      >
        <form id="edit-member-form" onSubmit={handleSaveEdit}>
          <Select
            id="edit-role"
            label="Papel"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as Role)}
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'catalog_manager', label: 'Gestor de Catálogo' },
              { value: 'resident', label: 'Morador' },
            ]}
          />
          <Input
            id="edit-weight"
            label="Peso de distribuição (%)"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={editWeight}
            onChange={(e) => setEditWeight(e.target.value)}
            placeholder="Ex: 40"
          />
          <Input
            id="edit-avail"
            label="Disponibilidade semanal (horas)"
            type="number"
            min="0"
            step="0.5"
            value={editAvailability}
            onChange={(e) => setEditAvailability(e.target.value)}
            placeholder="Ex: 10"
          />
        </form>
      </Modal>
    </div>
  );
}
