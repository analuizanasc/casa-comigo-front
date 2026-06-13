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
  it('renders children with default class papel-pill', () => {
    render(<Badge>Texto</Badge>);
    expect(screen.getByText('Texto')).toHaveClass('papel-pill');
  });

  it('renders with variant leve using selo selo--leve classes', () => {
    render(<Badge variant="leve">Leve</Badge>);
    const el = screen.getByText('Leve');
    expect(el).toHaveClass('selo');
    expect(el).toHaveClass('selo--leve');
  });

  it('renders with variant medio using selo selo--medio classes', () => {
    render(<Badge variant="medio">Médio</Badge>);
    const el = screen.getByText('Médio');
    expect(el).toHaveClass('selo');
    expect(el).toHaveClass('selo--medio');
  });

  it('renders with variant pesado using selo selo--pesado classes', () => {
    render(<Badge variant="pesado">Pesado</Badge>);
    const el = screen.getByText('Pesado');
    expect(el).toHaveClass('selo');
    expect(el).toHaveClass('selo--pesado');
  });

  it('renders with variant pendente using status status--pendente classes', () => {
    render(<Badge variant="pendente">Pendente</Badge>);
    const el = screen.getByText('Pendente');
    expect(el).toHaveClass('status');
    expect(el).toHaveClass('status--pendente');
  });

  it('renders with variant concluida using status status--concluida classes', () => {
    render(<Badge variant="concluida">Concluída</Badge>);
    const el = screen.getByText('Concluída');
    expect(el).toHaveClass('status');
    expect(el).toHaveClass('status--concluida');
  });

  it('renders with variant atrasada using status status--atrasada classes', () => {
    render(<Badge variant="atrasada">Atrasada</Badge>);
    const el = screen.getByText('Atrasada');
    expect(el).toHaveClass('status');
    expect(el).toHaveClass('status--atrasada');
  });

  it('renders with variant impedida using status status--impedida classes', () => {
    render(<Badge variant="impedida">Impedida</Badge>);
    const el = screen.getByText('Impedida');
    expect(el).toHaveClass('status');
    expect(el).toHaveClass('status--impedida');
  });

  it('renders with variant barro using selo selo--barro classes', () => {
    render(<Badge variant="barro">Barro</Badge>);
    const el = screen.getByText('Barro');
    expect(el).toHaveClass('selo');
    expect(el).toHaveClass('selo--barro');
  });

  it('renders with variant indigo using selo selo--indigo classes', () => {
    render(<Badge variant="indigo">Índigo</Badge>);
    const el = screen.getByText('Índigo');
    expect(el).toHaveClass('selo');
    expect(el).toHaveClass('selo--indigo');
  });
});

describe('effortLabel', () => {
  it('maps light to Leve', () => {
    expect(effortLabel.light).toBe('Leve');
  });

  it('maps medium to Médio', () => {
    expect(effortLabel.medium).toBe('Médio');
  });

  it('maps heavy to Pesado', () => {
    expect(effortLabel.heavy).toBe('Pesado');
  });
});

describe('effortVariant', () => {
  it('maps light to leve', () => {
    expect(effortVariant.light).toBe('leve');
  });

  it('maps medium to medio', () => {
    expect(effortVariant.medium).toBe('medio');
  });

  it('maps heavy to pesado', () => {
    expect(effortVariant.heavy).toBe('pesado');
  });
});

describe('frequencyLabel', () => {
  it('maps daily to Diária', () => {
    expect(frequencyLabel.daily).toBe('Diária');
  });

  it('maps weekly to Semanal', () => {
    expect(frequencyLabel.weekly).toBe('Semanal');
  });

  it('maps biweekly to Quinzenal', () => {
    expect(frequencyLabel.biweekly).toBe('Quinzenal');
  });

  it('maps monthly to Mensal', () => {
    expect(frequencyLabel.monthly).toBe('Mensal');
  });

  it('maps quarterly to Trimestral', () => {
    expect(frequencyLabel.quarterly).toBe('Trimestral');
  });

  it('maps annual to Anual', () => {
    expect(frequencyLabel.annual).toBe('Anual');
  });
});

describe('statusLabel', () => {
  it('maps pending to Pendente', () => {
    expect(statusLabel.pending).toBe('Pendente');
  });

  it('maps completed to Concluída', () => {
    expect(statusLabel.completed).toBe('Concluída');
  });

  it('maps overdue to Atrasada', () => {
    expect(statusLabel.overdue).toBe('Atrasada');
  });

  it('maps redistributed to Redistribuída', () => {
    expect(statusLabel.redistributed).toBe('Redistribuída');
  });
});

describe('statusVariant', () => {
  it('maps pending to pendente', () => {
    expect(statusVariant.pending).toBe('pendente');
  });

  it('maps completed to concluida', () => {
    expect(statusVariant.completed).toBe('concluida');
  });

  it('maps overdue to atrasada', () => {
    expect(statusVariant.overdue).toBe('atrasada');
  });

  it('maps redistributed to impedida', () => {
    expect(statusVariant.redistributed).toBe('impedida');
  });
});

describe('roleLabel', () => {
  it('maps admin to Administrador', () => {
    expect(roleLabel.admin).toBe('Administrador');
  });

  it('maps catalog_manager to Gestor de Catálogo', () => {
    expect(roleLabel.catalog_manager).toBe('Gestor de Catálogo');
  });

  it('maps resident to Morador', () => {
    expect(roleLabel.resident).toBe('Morador');
  });
});

describe('preferenceLabel', () => {
  it('maps hate to Não gosto', () => {
    expect(preferenceLabel.hate).toBe('Não gosto');
  });

  it('maps neutral to Neutro', () => {
    expect(preferenceLabel.neutral).toBe('Neutro');
  });

  it('maps like to Gosto', () => {
    expect(preferenceLabel.like).toBe('Gosto');
  });
});

describe('preferenceVariant', () => {
  it('maps hate to atrasada', () => {
    expect(preferenceVariant.hate).toBe('atrasada');
  });

  it('maps neutral to default', () => {
    expect(preferenceVariant.neutral).toBe('default');
  });

  it('maps like to concluida', () => {
    expect(preferenceVariant.like).toBe('concluida');
  });
});
