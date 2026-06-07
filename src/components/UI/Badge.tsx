type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'sage' | 'terracotta';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}

export const effortLabel: Record<string, string> = {
  light: 'Leve',
  medium: 'Médio',
  heavy: 'Pesado',
};

export const effortVariant: Record<string, BadgeVariant> = {
  light: 'sage',
  medium: 'warning',
  heavy: 'danger',
};

export const frequencyLabel: Record<string, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  biweekly: 'Quinzenal',
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  annual: 'Anual',
};

export const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  completed: 'Concluída',
  overdue: 'Atrasada',
  redistributed: 'Redistribuída',
};

export const statusVariant: Record<string, BadgeVariant> = {
  pending: 'info',
  completed: 'success',
  overdue: 'danger',
  redistributed: 'warning',
};

export const roleLabel: Record<string, string> = {
  admin: 'Administrador',
  catalog_manager: 'Gestor de Catálogo',
  resident: 'Morador',
};

export const preferenceLabel: Record<string, string> = {
  hate: 'Não gosto',
  neutral: 'Neutro',
  like: 'Gosto',
};

export const preferenceVariant: Record<string, BadgeVariant> = {
  hate: 'danger',
  neutral: 'default',
  like: 'success',
};
