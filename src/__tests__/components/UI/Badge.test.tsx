import { render, screen } from '@testing-library/react';
import {
  Badge,
  effortLabel, effortVariant,
  frequencyLabel,
  statusLabel, statusVariant,
  roleLabel,
  preferenceLabel, preferenceVariant,
} from '../../../components/UI/Badge';

describe('Badge component', () => {
  it('renders children with default variant class', () => {
    render(<Badge>Texto</Badge>);
    const el = screen.getByText('Texto');
    expect(el).toHaveClass('badge');
    expect(el).toHaveClass('badge--default');
  });

  it.each(['success', 'warning', 'danger', 'info', 'sage', 'terracotta'] as const)(
    'renders with variant %s',
    (variant) => {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toHaveClass(`badge--${variant}`);
    }
  );
});

describe('Badge lookup maps', () => {
  it('effortLabel has correct Portuguese labels', () => {
    expect(effortLabel.light).toBe('Leve');
    expect(effortLabel.medium).toBe('Médio');
    expect(effortLabel.heavy).toBe('Pesado');
  });

  it('effortVariant maps effort levels to badge variants', () => {
    expect(effortVariant.light).toBe('sage');
    expect(effortVariant.medium).toBe('warning');
    expect(effortVariant.heavy).toBe('danger');
  });

  it('frequencyLabel has all frequencies', () => {
    expect(frequencyLabel.daily).toBe('Diária');
    expect(frequencyLabel.weekly).toBe('Semanal');
    expect(frequencyLabel.biweekly).toBe('Quinzenal');
    expect(frequencyLabel.monthly).toBe('Mensal');
    expect(frequencyLabel.quarterly).toBe('Trimestral');
    expect(frequencyLabel.annual).toBe('Anual');
  });

  it('statusLabel has all statuses', () => {
    expect(statusLabel.pending).toBe('Pendente');
    expect(statusLabel.completed).toBe('Concluída');
    expect(statusLabel.overdue).toBe('Atrasada');
    expect(statusLabel.redistributed).toBe('Redistribuída');
  });

  it('statusVariant maps statuses to badge variants', () => {
    expect(statusVariant.pending).toBe('info');
    expect(statusVariant.completed).toBe('success');
    expect(statusVariant.overdue).toBe('danger');
    expect(statusVariant.redistributed).toBe('warning');
  });

  it('roleLabel has all roles', () => {
    expect(roleLabel.admin).toBe('Administrador');
    expect(roleLabel.catalog_manager).toBe('Gestor de Catálogo');
    expect(roleLabel.resident).toBe('Morador');
  });

  it('preferenceLabel has all levels', () => {
    expect(preferenceLabel.hate).toBe('Não gosto');
    expect(preferenceLabel.neutral).toBe('Neutro');
    expect(preferenceLabel.like).toBe('Gosto');
  });

  it('preferenceVariant maps preference levels', () => {
    expect(preferenceVariant.hate).toBe('danger');
    expect(preferenceVariant.neutral).toBe('default');
    expect(preferenceVariant.like).toBe('success');
  });
});
