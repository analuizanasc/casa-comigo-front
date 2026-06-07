import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyHouses, createHouse, joinHouse } from '../api/houses';
import { useHouse } from '../contexts/HouseContext';
import { useToast } from '../components/UI/Toast';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Modal } from '../components/UI/Modal';
import { PageSpinner } from '../components/UI/Spinner';
import { roleLabel } from '../components/UI/Badge';
import type { HouseSummary } from '../types';

export function Houses() {
  const { setCurrentHouse } = useHouse();
  const toast = useToast();
  const navigate = useNavigate();

  const [houses, setHouses] = useState<HouseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchHouses = async () => {
    try {
      const { data } = await getMyHouses();
      setHouses(data);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHouses(); }, []);

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
      fetchHouses();
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
      fetchHouses();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="app-shell app-shell--no-sidebar">
      <div className="houses-page">
        <div className="houses-page__header">
          <div>
            <h1 className="houses-page__title">
              <span>🏠</span> Minhas Casas
            </h1>
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
                <div className="house-card__icon">🏠</div>
                <div className="house-card__info">
                  <div className="house-card__name">{house.name}</div>
                  <div className="house-card__role">{roleLabel[house.role]}</div>
                </div>
                <span className="house-card__arrow">→</span>
              </button>
            ))}
          </div>
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
