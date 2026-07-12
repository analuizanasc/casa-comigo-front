function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function uniqueEmail(prefix = 'e2e'): string {
  return `${prefix}.${uniqueSuffix()}@teste.casacomigo.dev`;
}

export function uniqueName(prefix = 'Usuário E2E'): string {
  return `${prefix} ${uniqueSuffix()}`;
}

export function uniqueHouseName(prefix = 'Casa E2E'): string {
  return `${prefix} ${uniqueSuffix()}`;
}

export function uniqueTaskName(prefix = 'Tarefa E2E'): string {
  return `${prefix} ${uniqueSuffix()}`;
}

export const DEFAULT_PASSWORD = 'SenhaForte123';

export function isoDateOffset(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
}
