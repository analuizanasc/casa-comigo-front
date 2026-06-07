import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/UI/Toast';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

export function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginApi(form.email, form.password);
      login(data.token, data.user);
      navigate('/houses');
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span className="auth-card__logo">🏠</span>
          <h1 className="auth-card__title">Casa Comigo</h1>
          <p className="auth-card__subtitle">Bem-vindo de volta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="email"
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="seu@email.com"
            required
            autoComplete="email"
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••"
            required
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} size="lg" style={{ width: '100%' }}>
            Entrar
          </Button>
        </form>

        <p className="auth-card__footer">
          Não tem conta?{' '}
          <Link to="/register" className="auth-card__link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
