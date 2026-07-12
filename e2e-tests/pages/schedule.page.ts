import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SchedulePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.getByRole('link', { name: 'Cronograma' }).click();
    await expect(this.page.getByRole('heading', { name: 'Cronograma' })).toBeVisible();
  }

  async openDistribute(): Promise<void> {
    await this.page.getByRole('button', { name: '⚡ Distribuir tarefas' }).click();
  }

  async runDistribution(periodStart: string, periodEnd: string): Promise<void> {
    await this.page.getByLabel('Início do período').fill(periodStart);
    await this.page.getByLabel('Fim do período').fill(periodEnd);
    await this.page.getByRole('button', { name: 'Gerar distribuição' }).click();
  }

  get distributionResultStatus() {
    return this.page.locator('.dist-result__status');
  }

  get distributionBalanceItems() {
    return this.page.locator('.dist-balance__item');
  }

  async closeDistributionResult(): Promise<void> {
    await this.page.locator('.modal__footer').getByRole('button', { name: 'Fechar' }).click();
  }

  async setDateFilter(dateFrom: string, dateTo: string): Promise<void> {
    await this.page.getByLabel('De').fill(dateFrom);
    await this.page.getByLabel('Até').fill(dateTo);
  }

  /**
   * A recurring task can have several pending occurrences in the period, all
   * sharing the same name. Callers that care about a specific occurrence
   * resolve it up front (e.g. by scheduled_date via the API) and just need
   * "the earliest one still on screen", which `.first()` gives them since
   * the schedule is rendered sorted by date ascending.
   */
  assignmentCard(taskName: string) {
    return this.page.locator('.assignment-card').filter({ hasText: taskName }).first();
  }

  async completeTask(taskName: string, notes?: string): Promise<void> {
    await this.assignmentCard(taskName).getByRole('button', { name: '✓ Concluir' }).click();
    const dialog = this.page.getByRole('dialog');
    if (notes) {
      await dialog.getByLabel('Observação (opcional)').fill(notes);
    }
    await dialog.getByRole('button', { name: 'Confirmar' }).click();
  }

  async reportImpediment(taskName: string): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.assignmentCard(taskName).getByRole('button', { name: '⚠ Impedimento' }).click();
  }

  async reassignTask(taskName: string, newAssigneeName: string): Promise<void> {
    await this.assignmentCard(taskName).getByRole('button', { name: '↩ Reatribuir' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel('Novo responsável').selectOption({ label: newAssigneeName });
    await dialog.getByRole('button', { name: 'Reatribuir' }).click();
  }
}
