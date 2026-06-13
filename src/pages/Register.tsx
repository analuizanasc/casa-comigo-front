import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useToast } from '../components/UI/Toast';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

export function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast('A senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }
    setLoading(true);
    try {
      await registerApi(form.name, form.email, form.password);
      toast('Conta criada! Faça login para continuar.', 'success');
      navigate('/login');
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
          <div className="auth-card__logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </div>
          <h1 className="auth-card__title">Casa Comigo</h1>
          <p className="auth-card__subtitle">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="name"
            label="Nome"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Seu nome"
            required
            autoComplete="name"
          />
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
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} size="lg" style={{ width: '100%' }}>
            Criar conta
          </Button>
        </form>

        <p className="auth-card__footer">
          Já tem conta?{' '}
          <Link to="/login" className="auth-card__link">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
