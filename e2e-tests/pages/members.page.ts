import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class MembersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * The active house only lives in client-side React state (HouseContext),
   * set when a house card is clicked on the Houses page. A direct
   * `page.goto()` to a house sub-route forces a full reload and loses that
   * state, so once inside a house we always navigate via the sidebar links.
   */
  async goto(): Promise<void> {
    await this.page.getByRole('link', { name: 'Membros' }).click();
    await expect(this.page.getByRole('heading', { name: 'Membros' })).toBeVisible();
  }

  async inviteMember(email: string): Promise<void> {
    await this.page.getByRole('button', { name: '+ Convidar membro' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel('E-mail do morador').fill(email);
    await dialog.getByRole('button', { name: 'Convidar' }).click();
  }

  memberCard(name: string) {
    return this.page.locator('.member-card').filter({ hasText: name });
  }

  async openEdit(memberName: string): Promise<void> {
    await this.memberCard(memberName).getByRole('button', { name: 'Editar' }).click();
  }

  async setRole(role: 'Administrador' | 'Gestor de Catálogo' | 'Morador'): Promise<void> {
    await this.page.getByLabel('Papel').selectOption({ label: role });
  }

  async setWeight(weightPercentage: number): Promise<void> {
    await this.page.getByLabel('Peso de distribuição (%)').fill(String(weightPercentage));
  }

  async setAvailability(hours: number): Promise<void> {
    await this.page.getByLabel('Disponibilidade semanal (horas)').fill(String(hours));
  }

  async saveEdit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Salvar' }).click();
  }

  async removeMember(memberName: string): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.memberCard(memberName).getByRole('button', { name: 'Remover' }).click();
  }
}
