/* Casa Comigo · UI kit — Login (tela de entrada). */

const { useState } = React;
const DSL = window.CasaComigoDesignSystem_64c258;

function Login({ onEnter }) {
  const { Button, Input } = DSL;
  const [form, setForm] = useState({ email: 'qa@casacomigo.app', password: '••••••' });
  const [loading, setLoading] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onEnter(); }, 650);
  };
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Card elevation="lg" padding="36px 32px" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <span className="cc-sol" style={{ width: 64, height: 64, margin: '0 auto 14px' }} />
            <h1 className="cc-display" style={{ fontSize: 34 }}>Casa Comigo</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 15 }}>Bem-vindo de volta</p>
          </div>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input id="email" label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" />
            <Input id="password" label="Senha" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" />
            <Button type="submit" size="lg" loading={loading} style={{ width: '100%' }}>Entrar</Button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--text-body)' }}>
            Não tem conta? <span style={{ color: 'var(--link)', fontWeight: 700, cursor: 'pointer' }}>Cadastre-se</span>
          </p>
        </Card>
      </div>
    </div>
  );
}

const { Card } = DSL;
Object.assign(window, { Login });
