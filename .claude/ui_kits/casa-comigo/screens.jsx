/* Casa Comigo · UI kit — telas. Compõem os primitivos do design system. */

const { useState } = React;
const DS = window.CasaComigoDesignSystem_64c258;
const { Button, Card, Badge, Tag, Avatar, ProgressBar, ProgressRing, PreferenceToggle, Input, Select } = DS;
const effortLabel = { light: 'Leve', medium: 'Médio', heavy: 'Pesado' };
const effortVariant = { light: 'sage', medium: 'warning', heavy: 'danger' };
const statusLabel = { pending: 'Pendente', completed: 'Concluída', overdue: 'Atrasada', redistributed: 'Redistribuída' };
const statusVariant = { pending: 'info', completed: 'success', overdue: 'danger', redistributed: 'warning' };

/* ---- dados ---- */
const TASKS = [
  { id: 1, name: 'Aguar plantas', effort: 'light',  time: '15min', freq: 'Diária',  room: null,    who: 'qa',      tone: 'barro',  day: 'Dom · 07/06', status: 'pending' },
  { id: 2, name: 'Lavar roupa',   effort: 'medium', time: '30min', freq: 'Semanal', room: null,    who: 'Marcelo', tone: 'indigo', day: 'Seg · 08/06', status: 'completed', at: '09:12' },
  { id: 3, name: 'Passar pano',   effort: 'heavy',  time: '40min', freq: 'Semanal', room: null,    who: 'qa',      tone: 'barro',  day: 'Seg · 08/06', status: 'overdue', blocked: true },
  { id: 4, name: 'Espanar casa',  effort: 'medium', time: '15min', freq: 'Semanal', room: 'casa',  who: 'Marcelo', tone: 'indigo', day: 'Ter · 09/06', status: 'pending' },
];

/* ---- faixa de aviso semântico ---- */
function Aviso({ kind = 'atencao', children }) {
  const map = {
    ok:      { bg: 'var(--sucesso-claro)', bd: 'var(--sucesso)', fg: '#003a26', icon: 'check' },
    atencao: { bg: 'var(--aviso-claro)',   bd: '#C99A05',        fg: '#6b5202', icon: 'alert' },
    erro:    { bg: 'var(--alerta-claro)',  bd: 'var(--alerta)',  fg: '#7d1610', icon: 'x' },
  };
  const t = map[kind] || map.atencao;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px',
      background: t.bg, border: `1px solid ${t.bd}`, borderRadius: 'var(--radius-sm)',
      color: t.fg, fontWeight: 600, fontSize: 14,
    }}>
      <Icon name={t.icon} size={18} color={t.bd} paper={t.bg} />
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{children}</span>
    </div>
  );
}

/* ---- linha de avatar + nome (chip) ---- */
function WhoChip({ who, tone }) {
  return (
    <Tag><Avatar name={who} tone={tone} size={20} style={{ marginLeft: -4 }} /> {who}</Tag>
  );
}

/* ============ CRONOGRAMA ============ */
function Schedule() {
  const [done, setDone] = useState({});
  const days = [...new Set(TASKS.map((t) => t.day))];
  return (
    <div>
      <PageHeader eyebrow="Mutirão da semana" title="Cronograma" meta="4 tarefas no período"
        action={<Button variant="primary" size="lg" iconLeft={<Icon name="zap" size={18} />}>Distribuir tarefas</Button>} />

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 26 }}>
        <div style={{ minWidth: 150 }}><Input id="de" label="De" type="date" defaultValue="2026-06-07" /></div>
        <div style={{ minWidth: 150 }}><Input id="ate" label="Até" type="date" defaultValue="2026-07-07" /></div>
        <div style={{ minWidth: 170 }}><Select id="m" label="Morador" options={[{value:'todos',label:'Todos'},{value:'qa',label:'qa'},{value:'marcelo',label:'Marcelo'}]} /></div>
      </div>

      {days.map((day) => (
        <div key={day}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '26px 0 14px' }}>
            <span style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 21 }}>{day}</span>
            <span style={{ flex: 1, borderTop: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TASKS.filter((t) => t.day === day).map((t) => {
              const isDone = done[t.id] || t.status === 'completed';
              const st = isDone ? 'completed' : t.status;
              return (
                <Card key={t.id} interactive>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700 }}>{t.name}</h3>
                    <Badge variant={statusVariant[st]} dot>{statusLabel[st]}</Badge>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                    <Badge variant={effortVariant[t.effort]}>{effortLabel[t.effort]}</Badge>
                    {t.room && <Tag><Icon name="house" size={14} /> {t.room}</Tag>}
                    <Tag><Icon name="clock" size={14} /> {t.time}</Tag>
                    <WhoChip who={t.who} tone={t.tone} />
                  </div>
                  {t.blocked && !isDone && (
                    <div style={{ marginTop: 14 }}>
                      <Aviso kind="atencao">Faltou material de limpeza — reatribuição sugerida.</Aviso>
                    </div>
                  )}
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-faint)', margin: '16px 0' }} />
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {isDone ? (
                      <Button variant="ghost" size="sm" iconLeft={<Icon name="check" size={15} color="var(--verde)" />} style={{ color: 'var(--verde)' }}>
                        Concluída{t.at ? ` às ${t.at}` : ''}
                      </Button>
                    ) : (
                      <>
                        <Button variant="secondary" size="sm" iconLeft={<Icon name="check" size={15} />} onClick={() => setDone((d) => ({ ...d, [t.id]: true }))}>Concluir</Button>
                        <Button variant="ghost" size="sm" iconLeft={<Icon name="alert" size={15} />}>Impedimento</Button>
                        <Button variant="ghost" size="sm" iconLeft={<Icon name="repeat" size={15} />}>Reatribuir</Button>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ CATÁLOGO ============ */
function Catalog() {
  return (
    <div>
      <PageHeader eyebrow="A despensa de serviços" title="Catálogo de tarefas" meta="4 tarefas cadastradas"
        action={<Button variant="primary" size="lg" iconLeft={<Icon name="plus" size={18} />}>Nova tarefa</Button>} />
      <div style={{ maxWidth: 520, marginBottom: 24 }}>
        <Input id="busca" placeholder="Buscar por nome ou cômodo…" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {TASKS.map((t) => (
          <Card key={t.id} interactive>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <h3 style={{ fontSize: 19, fontWeight: 700 }}>{t.name}</h3>
              <Badge variant={effortVariant[t.effort]}>{effortLabel[t.effort]}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              {t.room && <Tag><Icon name="house" size={14} /> {t.room}</Tag>}
              <Tag><Icon name="repeat" size={14} /> {t.freq}</Tag>
              <Tag><Icon name="clock" size={14} /> {t.time}</Tag>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-faint)', margin: '16px 0' }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant="ghost" size="sm">Dependências</Button>
              <Button variant="ghost" size="sm">Editar</Button>
              <Button variant="ghost" size="sm" style={{ color: 'var(--vermelho)' }}>Remover</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============ PREFERÊNCIAS ============ */
function Preferences() {
  const init = { 1: 'like', 2: 'like', 3: 'hate', 4: 'neutral' };
  const [prefs, setPrefs] = useState(init);
  const [lim, setLim] = useState({ 3: true });
  return (
    <div>
      <PageHeader eyebrow="Cada um no seu feitio" title="Minhas preferências" meta="Diga o que você gosta e o que tem limitações" />
      <div style={{ maxWidth: 520, marginBottom: 22 }}>
        <Input id="busca" placeholder="Buscar tarefa ou cômodo…" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TASKS.map((t) => (
          <Card key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{t.name}</h3>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {t.room && <Tag><Icon name="house" size={14} /> {t.room}</Tag>}
                <Badge variant={effortVariant[t.effort]}>{effortLabel[t.effort]}</Badge>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <PreferenceToggle value={prefs[t.id]} onChange={(v) => setPrefs((p) => ({ ...p, [t.id]: v }))} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: 'var(--text-body)', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!lim[t.id]} onChange={(e) => setLim((l) => ({ ...l, [t.id]: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--barro)' }} />
                Limitação física
              </label>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Schedule, Catalog, Preferences, Aviso, WhoChip, TASKS });
