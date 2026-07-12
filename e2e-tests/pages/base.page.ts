import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async expectToast(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
