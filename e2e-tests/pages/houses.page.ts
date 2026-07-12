import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HousesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/houses');
    await expect(this.page.getByRole('heading', { name: 'Minhas Casas' })).toBeVisible();
    await this.dismissOnboardingIfPresent();
  }

  /**
   * New accounts start with an onboarding_step of 0, which renders a
   * full-screen overlay that blocks every other control on this page. The
   * overlay only mounts once the houses/invitations/onboarding fetch
   * resolves, so we wait for that instead of racing the initial render.
   */
  async dismissOnboardingIfPresent(): Promise<void> {
    const overlay = this.page.locator('.onboarding-overlay');
    const createButton = this.page.getByRole('button', { name: '+ Nova casa' });
    await expect(createButton).toBeVisible();

    for (let i = 0; i < 6 && (await overlay.isVisible()); i++) {
      const onboardingUpdated = this.page.waitForResponse(
        (res) => res.url().includes('/me/onboarding') && res.request().method() === 'PATCH'
      );
      await this.page.getByRole('button', { name: /Próximo|Começar/ }).click();
      await onboardingUpdated;
    }
    await expect(overlay).toBeHidden();
  }

  async createHouse(name: string): Promise<void> {
    await this.page.getByRole('button', { name: '+ Nova casa' }).click();
    await this.page.getByLabel('Nome da casa').fill(name);
    await this.page.getByRole('button', { name: 'Criar' }).click();
  }

  async joinHouseWithCode(code: string): Promise<void> {
    await this.page.getByRole('button', { name: 'Entrar com código' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel('Código de convite').fill(code);
    await dialog.getByRole('button', { name: 'Entrar' }).click();
  }

  houseCard(houseName: string) {
    return this.page.locator('.house-card').filter({ hasText: houseName });
  }

  async enterHouse(houseName: string): Promise<void> {
    await this.houseCard(houseName).click();
    await expect(this.page).toHaveURL(/\/houses\/.+\/schedule/);
  }

  invitationCard(houseName: string) {
    return this.page.locator('.invitation-card').filter({ hasText: houseName });
  }

  async acceptInvitation(houseName: string): Promise<void> {
    await this.invitationCard(houseName).getByRole('button', { name: 'Aceitar' }).click();
  }

  async rejectInvitation(houseName: string): Promise<void> {
    await this.invitationCard(houseName).getByRole('button', { name: 'Recusar' }).click();
  }
}
