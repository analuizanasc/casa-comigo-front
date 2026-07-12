import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export interface TaskFormInput {
  name: string;
  description?: string;
  frequency?: 'Diária' | 'Semanal' | 'Quinzenal' | 'Mensal' | 'Trimestral' | 'Anual';
  effort?: 'Leve' | 'Médio' | 'Pesado';
  durationMinutes?: number;
  room?: string;
}

export class CatalogPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.getByRole('link', { name: 'Catálogo' }).click();
    await expect(this.page.getByRole('heading', { name: 'Catálogo de Tarefas' })).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.page.getByRole('button', { name: '+ Nova tarefa' }).click();
  }

  async fillTaskForm(data: TaskFormInput): Promise<void> {
    await this.page.getByLabel('Nome da tarefa').fill(data.name);
    if (data.description) {
      await this.page.getByLabel('Descrição (opcional)').fill(data.description);
    }
    if (data.frequency) {
      await this.page.getByLabel('Frequência').selectOption({ label: data.frequency });
    }
    if (data.effort) {
      await this.page.getByLabel('Nível de esforço').selectOption({ label: data.effort });
    }
    if (data.durationMinutes) {
      await this.page.getByLabel('Duração (minutos)').fill(String(data.durationMinutes));
    }
    if (data.room) {
      await this.page.getByLabel('Cômodo (opcional)').fill(data.room);
    }
  }

  async submitTaskForm(mode: 'create' | 'edit' = 'create'): Promise<void> {
    await this.page.getByRole('button', { name: mode === 'create' ? 'Criar' : 'Salvar' }).click();
  }

  async createTask(data: TaskFormInput): Promise<void> {
    await this.openCreateForm();
    await this.fillTaskForm(data);
    await this.submitTaskForm('create');
  }

  taskCard(name: string) {
    return this.page.locator('.task-card').filter({ hasText: name });
  }

  async openEditTask(name: string): Promise<void> {
    await this.taskCard(name).getByRole('button', { name: 'Editar' }).click();
  }

  async deleteTask(name: string): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.taskCard(name).getByRole('button', { name: 'Remover' }).click();
  }

  async openDependencies(name: string): Promise<void> {
    await this.taskCard(name).getByRole('button', { name: 'Dependências' }).click();
  }

  async addDependency(taskName: string): Promise<void> {
    await this.page.getByLabel('Adicionar dependência').selectOption({ label: taskName });
    await this.page.getByRole('button', { name: 'Adicionar' }).click();
  }

  dependencyItem(taskName: string) {
    return this.page.locator('.dep-item').filter({ hasText: taskName });
  }

  async removeDependency(taskName: string): Promise<void> {
    await this.dependencyItem(taskName).getByRole('button', { name: 'Remover' }).click();
  }

  async search(term: string): Promise<void> {
    await this.page.getByPlaceholder('Buscar por nome ou cômodo...').fill(term);
  }
}
