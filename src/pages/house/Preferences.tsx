import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listPreferences, setPreference } from '../../api/preferences';
import { useToast } from '../../components/UI/Toast';
import { Badge, effortLabel, effortVariant, preferenceLabel } from '../../components/UI/Badge';
import { PageSpinner } from '../../components/UI/Spinner';
import type { Preference, PreferenceLevel } from '../../types';

const preferenceLevels: PreferenceLevel[] = ['hate', 'neutral', 'like'];

const prefIcons: Record<PreferenceLevel, string> = {
  hate: '👎',
  neutral: '😐',
  like: '👍',
};

export function Preferences() {
  const { houseId } = useParams<{ houseId: string }>();
  const toast = useToast();

  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchPreferences = async () => {
    if (!houseId) return;
    try {
      const { data } = await listPreferences(houseId);
      setPreferences(data);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPreferences(); }, [houseId]);

  const handlePreference = async (taskId: string, preference_level: PreferenceLevel) => {
    if (!houseId) return;
    const current = preferences.find((p) => p.task_id === taskId);
    setUpdating(taskId);
    try {
      await setPreference(houseId, taskId, {
        preference_level,
        has_physical_limitation: current?.has_physical_limitation ?? false,
      });
      setPreferences((prev) =>
        prev.map((p) => p.task_id === taskId ? { ...p, preference_level } : p)
      );
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleLimitation = async (taskId: string, has_physical_limitation: boolean) => {
    if (!houseId) return;
    const current = preferences.find((p) => p.task_id === taskId);
    if (!current) return;
    setUpdating(taskId);
    try {
      await setPreference(houseId, taskId, {
        preference_level: current.preference_level,
        has_physical_limitation,
      });
      setPreferences((prev) =>
        prev.map((p) => p.task_id === taskId ? { ...p, has_physical_limitation } : p)
      );
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = preferences.filter((p) =>
    p.task_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.room ?? '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageSpinner />;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Minhas Preferências</h1>
          <p className="page__subtitle">Diga o que você gosta e o que tem limitações</p>
        </div>
      </div>

      <div className="page__toolbar">
        <input
          className="search-input"
          placeholder="Buscar tarefa ou cômodo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">❤️</div>
          <p className="empty-state__text">Nenhuma tarefa no catálogo ainda.</p>
        </div>
      ) : (
        <div className="pref-list">
          {filtered.map((pref) => (
            <div
              key={pref.task_id}
              className={`pref-card ${pref.has_physical_limitation ? 'pref-card--limited' : ''}`}
            >
              <div className="pref-card__info">
                <div className="pref-card__name">{pref.task_name}</div>
                <div className="pref-card__meta">
                  {pref.room && <span className="pref-card__room">🏠 {pref.room}</span>}
                  <Badge variant={effortVariant[pref.effort_level]}>
                    {effortLabel[pref.effort_level]}
                  </Badge>
                </div>
              </div>

              <div className="pref-card__controls">
                <div className="pref-toggle">
                  {preferenceLevels.map((level) => (
                    <button
                      key={level}
                      className={`pref-toggle__btn ${pref.preference_level === level ? 'pref-toggle__btn--active' : ''}`}
                      onClick={() => handlePreference(pref.task_id, level)}
                      disabled={updating === pref.task_id}
                      title={preferenceLabel[level]}
                    >
                      {prefIcons[level]}
                    </button>
                  ))}
                </div>

                <label className="pref-limit-toggle" title="Limitação física — esta tarefa nunca será atribuída a você">
                  <input
                    type="checkbox"
                    checked={pref.has_physical_limitation}
                    onChange={(e) => handleLimitation(pref.task_id, e.target.checked)}
                    disabled={updating === pref.task_id}
                  />
                  <span className="pref-limit-toggle__label">
                    {pref.has_physical_limitation ? '🚫 Limitação física' : 'Limitação física'}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
