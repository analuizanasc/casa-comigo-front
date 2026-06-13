/* Casa Comigo · UI kit — Membros e Relatórios. */

const DS2 = window.CasaComigoDesignSystem_64c258;
const { Button: Btn, Card: Crd, Badge: Bdg, Tag: Tg, Avatar: Av, ProgressBar: PB, ProgressRing: PR } = DS2;
const roleLbl = { admin: 'Administrador', catalog_manager: 'Gestor de Catálogo', resident: 'Morador' };

/* ============ MEMBROS ============ */
function Members() {
  return (
    <div>
      <PageHeader eyebrow="Quem mora na casa" title="Membros" meta="2 membros na casa"
        action={<Btn variant="primary" size="lg" iconLeft={<Icon name="userplus" size={18} />}>Convidar membro</Btn>} />

      <Crd style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <strong style={{ fontSize: 18 }}>Distribuição de carga</strong>
          <Bdg variant="info" dot>Distribuição igualitária</Bdg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
          {MEMBERS.map((m) => (
            <div key={m.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontWeight: 600 }}>{m.name}</span>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>50%</strong>
              </div>
              <PB value={50} tone={m.tone === 'indigo' ? 'verde' : 'barro'} />
            </div>
          ))}
        </div>
      </Crd>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MEMBERS.map((m) => (
          <Crd key={m.id} interactive style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <Av name={m.name} tone={m.tone} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <strong style={{ fontSize: 18 }}>{m.name}</strong>
                  <div style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>{m.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Editar</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--vermelho)', cursor: 'pointer' }}>Remover</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <Bdg variant={m.role === 'admin' ? 'terracotta' : 'default'}>{roleLbl[m.role]}</Bdg>
                <Tg><Icon name="clock" size={14} /> 10h/sem</Tg>
              </div>
            </div>
          </Crd>
        ))}
      </div>
    </div>
  );
}

/* ============ RELATÓRIOS ============ */
function StatGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, textAlign: 'center' }}>
      {items.map((s) => (
        <div key={s.lab}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1, color: s.color }}>{s.num}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.03em', marginTop: 6 }}>{s.lab}</div>
        </div>
      ))}
    </div>
  );
}

function Reports() {
  const balance = [
    { name: 'qa',      target: 50, real: 54.5, dev: '+4,5pp', devColor: 'var(--barro)', tone: 'barro', tasks: 3, pend: 3 },
    { name: 'Marcelo', target: 50, real: 45.5, dev: '−4,5pp', devColor: 'var(--indigo)', tone: 'indigo', tasks: 2, pend: 2 },
  ];
  return (
    <div>
      <PageHeader eyebrow="A conta do mutirão" title="Relatórios" meta="Desempenho e balanceamento da casa" />

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ minWidth: 150 }}><Input id="de" label="De" type="date" defaultValue="2026-05-08" /></div>
        <div style={{ minWidth: 150 }}><Input id="ate" label="Até" type="date" defaultValue="2026-06-07" /></div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 26, margin: '8px 0 16px' }}>Balanceamento de esforço</h2>
      <div style={{ marginBottom: 18 }}>
        <Aviso kind="ok">Dentro da tolerância — Tolerância ±10pp <Bdg variant="info" dot>Igualitária</Bdg></Aviso>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {balance.map((b) => (
          <Crd key={b.name}>
            <strong style={{ fontSize: 18 }}>{b.name}</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 42, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Alvo</span>
                <div style={{ flex: 1 }}><PB value={b.target} tone="indigo" /></div>
                <strong style={{ width: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{b.target.toFixed(1).replace('.', ',')}%</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 42, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Real</span>
                <div style={{ flex: 1 }}><PB value={b.real} tone="verde" /></div>
                <strong style={{ width: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{b.real.toFixed(1).replace('.', ',')}%</strong>
              </div>
            </div>
            <div style={{ marginTop: 14, fontWeight: 700, fontSize: 14, color: b.devColor }}>Desvio: {b.dev}</div>
          </Crd>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 26, margin: '36px 0 16px' }}>Desempenho por morador</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {balance.map((b) => (
          <Crd key={b.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Av name={b.name} tone={b.tone} />
                <div><strong style={{ fontSize: 17 }}>{b.name}</strong><div style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>{b.tasks} tarefas atribuídas</div></div>
              </div>
              <PR value={0} tone={b.tone === 'indigo' ? 'indigo' : 'barro'} />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-faint)', margin: '16px 0' }} />
            <StatGrid items={[
              { num: 0, lab: 'Concluídas', color: 'var(--verde)' },
              { num: b.pend, lab: 'Pendentes', color: 'var(--ocre)' },
              { num: 0, lab: 'Atrasadas', color: 'var(--vermelho)' },
              { num: 0, lab: 'Redistribuídas', color: 'var(--indigo)' },
            ]} />
          </Crd>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Members, Reports });
