import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyHouses, createHouse, joinHouse } from '../api/houses';
import { listInvitations, acceptInvitation, rejectInvitation } from '../api/invitations';
import { listNotifications, markAllRead } from '../api/notifications';
import { getOnboarding, advanceOnboarding } from '../api/me';
import { useHouse } from '../contexts/HouseContext';
import { useToast } from '../components/UI/Toast';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Modal } from '../components/UI/Modal';
import { PageSpinner } from '../components/UI/Spinner';
import { roleLabel } from '../components/UI/Badge';
import type { HouseSummary, Invitation, AppNotification, OnboardingStatus } from '../types';

const ONBOARDING_STEPS = [
  {
    icon: '🏠',
    title: 'Bem-vindo ao Casa Comigo!',
    body: 'Gerencie as tarefas da sua casa de forma colaborativa e equilibrada entre todos os moradores.',
  },
  {
    icon: '🧑‍🤝‍🧑',
    title: 'Sua casa, seus moradores',
    body: 'Crie ou entre em uma casa. Convide moradores e defina o papel de cada um: administrador, gestor de catálogo ou morador.',
  },
  {
    icon: '📋',
    title: 'Preferências e catálogo',
    body: 'Informe quais tarefas você gosta, não gosta ou tem limitação física. O sistema usa essas informações para distribuir as tarefas de forma justa.',
  },
  {
    icon: '✅',
    title: 'Tudo pronto!',
    body: 'Acompanhe o cronograma, marque tarefas como concluídas e veja relatórios de desempenho. Vamos começar!',
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

export function Houses() {
  const { setCurrentHouse } = useHouse();
  const toast = useToast();
  const navigate = useNavigate();

  const [houses, setHouses] = useState<HouseSummary[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [inviteSaving, setInviteSaving] = useState<string | null>(null);
  const [advancingOnboarding, setAdvancingOnboarding] = useState(false);

  const fetchAll = async () => {
    try {
      const [housesRes, invRes, notifRes, onbRes] = await Promise.all([
        getMyHouses(),
        listInvitations().catch(() => ({ data: [] as Invitation[] })),
        listNotifications().catch(() => ({ data: [] as AppNotification[] })),
        getOnboarding().catch(() => null),
      ]);
      setHouses(housesRes.data);
      setInvitations(invRes.data);
      setNotifications(notifRes.data);
      if (onbRes) setOnboarding(onbRes.data);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleEnter = (house: HouseSummary) => {
    setCurrentHouse(house);
    navigate(`/houses/${house.id}/schedule`);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createHouse(createName);
      toast('Casa criada com sucesso!', 'success');
      setCreateOpen(false);
      setCreateName('');
      fetchAll();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await joinHouse(inviteCode.toUpperCase());
      toast('Você entrou na casa!', 'success');
      setJoinOpen(false);
      setInviteCode('');
      fetchAll();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAccept = async (inv: Invitation) => {
    setInviteSaving(inv.id);
    try {
      const { data } = await acceptInvitation(inv.id);
      toast(data.message, 'success');
      fetchAll();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setInviteSaving(null);
    }
  };

  const handleReject = async (inv: Invitation) => {
    setInviteSaving(inv.id);
    try {
      await rejectInvitation(inv.id);
      toast('Convite recusado.', 'success');
      setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setInviteSaving(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleAdvanceOnboarding = async () => {
    if (!onboarding || advancingOnboarding) return;
    setAdvancingOnboarding(true);
    try {
      const { data } = await advanceOnboarding();
      setOnboarding(data);
    } catch {
      // silently ignore — don't block the user
      setOnboarding((prev) => prev ? { ...prev, completed: true } : null);
    } finally {
      setAdvancingOnboarding(false);
    }
  };

  const otherNotifications = notifications.filter((n) => n.type !== 'house_invitation');
  const unreadCount = otherNotifications.filter((n) => !n.is_read).length;

  if (loading) return <PageSpinner />;

  const showOnboarding = onboarding && !onboarding.completed;
  const currentStep = onboarding?.current_step ?? 0;
  const stepData = ONBOARDING_STEPS[currentStep] ?? ONBOARDING_STEPS[ONBOARDING_STEPS.length - 1];
  const isLastStep = currentStep >= (onboarding?.total_steps ?? 4) - 1;

  return (
    <div>
      {showOnboarding && (
        <div className="onboarding-overlay">
          <div className="onboarding-modal">
            <div className="onboarding-step">
              <div className="onboarding-step__icon">{stepData.icon}</div>
              <h2 className="onboarding-step__title">{stepData.title}</h2>
              <p className="onboarding-step__body">{stepData.body}</p>
            </div>
            <div className="onboarding-step__dots">
              {ONBOARDING_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`onboarding-dot ${i === currentStep ? 'onboarding-dot--active' : i < currentStep ? 'onboarding-dot--done' : ''}`}
                />
              ))}
            </div>
            <Button
              onClick={handleAdvanceOnboarding}
              loading={advancingOnboarding}
              size="lg"
            >
              {isLastStep ? 'Começar' : 'Próximo'}
            </Button>
          </div>
        </div>
      )}

      <div className="houses-page">
        <div className="houses-page__header">
          <div>
            <h1 className="houses-page__title">Minhas Casas</h1>
            <p className="houses-page__subtitle">Selecione uma casa para continuar</p>
          </div>
          <div className="houses-page__actions">
            <Button variant="secondary" onClick={() => setJoinOpen(true)}>
              Entrar com código
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              + Nova casa
            </Button>
          </div>
        </div>

        {invitations.length > 0 && (
          <section className="invitations-panel">
            <h2 className="invitations-panel__title">Convites pendentes</h2>
            <div className="invitations-list">
              {invitations.map((inv) => (
                <div key={inv.id} className="invitation-card">
                  <div className="invitation-card__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                      <rect x="2" y="4" width="20" height="16" rx="1" />
                      <path d="M2 4l10 9 10-9" />
                    </svg>
                  </div>
                  <div className="invitation-card__info">
                    <div className="invitation-card__house">{inv.house_name}</div>
                    <div className="invitation-card__from">Convidado por {inv.invited_by_name}</div>
                  </div>
                  <div className="invitation-card__actions">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(inv)}
                      loading={inviteSaving === inv.id}
                    >
                      Aceitar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReject(inv)}
                      loading={inviteSaving === inv.id}
                    >
                      Recusar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {houses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🏡</div>
            <p className="empty-state__text">Você ainda não faz parte de nenhuma casa.</p>
            <p className="empty-state__hint">Crie uma nova ou entre com um código de convite.</p>
          </div>
        ) : (
          <div className="houses-grid">
            {houses.map((house) => (
              <button
                key={house.id}
                className="house-card"
                onClick={() => handleEnter(house)}
              >
                <div className="house-card__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                    <path d="M9 21V12h6v9" />
                  </svg>
                </div>
                <div className="house-card__info">
                  <div className="house-card__name">{house.name}</div>
                  <div className="house-card__role">{roleLabel[house.role]}</div>
                </div>
                <span className="house-card__arrow">→</span>
              </button>
            ))}
          </div>
        )}

        {otherNotifications.length > 0 && (
          <section className="notifications-panel">
            <div className="notifications-panel__header">
              <h2 className="notifications-panel__title">
                Notificações
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </h2>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                  Marcar todas como lidas
                </Button>
              )}
            </div>
            <div className="notifications-list">
              {otherNotifications.map((n) => (
                <div key={n.id} className={`notif-card ${!n.is_read ? 'notif-card--unread' : ''}`}>
                  <div className="notif-card__content">
                    <div className="notif-card__title">{n.title}</div>
                    <div className="notif-card__body">{n.body}</div>
                    <div className="notif-card__time">{timeAgo(n.created_at)}</div>
                  </div>
                  {!n.is_read && <div className="notif-card__dot" />}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Modal
        title="Criar nova casa"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button form="create-house-form" type="submit" loading={saving}>Criar</Button>
          </>
        }
      >
        <form id="create-house-form" onSubmit={handleCreate}>
          <Input
            id="house-name"
            label="Nome da casa"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="Ex: Apartamento 42"
            required
            autoFocus
          />
        </form>
      </Modal>

      <Modal
        title="Entrar com código de convite"
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setJoinOpen(false)}>Cancelar</Button>
            <Button form="join-house-form" type="submit" loading={saving}>Entrar</Button>
          </>
        }
      >
        <form id="join-house-form" onSubmit={handleJoin}>
          <Input
            id="invite-code"
            label="Código de convite"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Ex: ABC123"
            required
            autoFocus
            style={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}
          />
        </form>
      </Modal>
    </div>
  );
}
