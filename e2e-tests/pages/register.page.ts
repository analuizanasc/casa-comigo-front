import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.page.getByLabel('Nome').fill(name);
    await this.page.getByLabel('E-mail').fill(email);
    await this.page.getByLabel('Senha').fill(password);
    await this.page.getByRole('button', { name: 'Criar conta' }).click();
  }
}
