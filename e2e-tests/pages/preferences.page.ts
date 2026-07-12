import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export type PreferenceLevel = 'odeio' | 'neutro' | 'gosto';

const PREFERENCE_TITLE: Record<PreferenceLevel, string> = {
  odeio: 'Não gosto',
  neutro: 'Neutro',
  gosto: 'Gosto',
};

export class PreferencesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.getByRole('link', { name: 'Preferências' }).click();
    await expect(this.page.getByRole('heading', { name: 'Minhas Preferências' })).toBeVisible();
  }

  prefCard(taskName: string) {
    return this.page.locator('.pref-card').filter({ hasText: taskName });
  }

  async setPreference(taskName: string, level: PreferenceLevel): Promise<void> {
    await this.prefCard(taskName).locator(`[title="${PREFERENCE_TITLE[level]}"]`).click();
  }

  /**
   * The checkbox's `checked` state is React-controlled and only flips once
   * the PATCH request resolves, so we click and let the caller assert the
   * resulting state with an auto-retrying `expect` instead of relying on
   * Playwright's `check()`/`uncheck()` (which expect a native, instant toggle).
   */
  async toggleLimitation(taskName: string, checked: boolean): Promise<void> {
    const checkbox = this.limitationCheckbox(taskName);
    if ((await checkbox.isChecked()) !== checked) {
      await checkbox.click();
    }
  }

  isPreferenceActive(taskName: string, level: PreferenceLevel) {
    return this.prefCard(taskName).locator(`[title="${PREFERENCE_TITLE[level]}"]`);
  }

  limitationCheckbox(taskName: string) {
    return this.prefCard(taskName).locator('.pref-limit-toggle input[type="checkbox"]');
  }

  async search(term: string): Promise<void> {
    await this.page.getByPlaceholder('Buscar tarefa ou cômodo...').fill(term);
  }
}
