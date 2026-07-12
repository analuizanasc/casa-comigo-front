import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ReportsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.sidebarLink.click();
    await expect(this.page.getByRole('heading', { name: 'Relatórios' })).toBeVisible();
  }

  get sidebarLink() {
    return this.page.getByRole('link', { name: 'Relatórios' });
  }

  /**
   * The sidebar only links to Reports for admins (see Sidebar.tsx navItems).
   * A resident has no in-app link to this page — reaching it is only
   * possible via a direct URL, same as a real user typing/bookmarking it.
   */
  async gotoDirect(houseId: string): Promise<void> {
    await this.page.goto(`/houses/${houseId}/reports`);
    await expect(this.page.getByRole('heading', { name: 'Relatórios' })).toBeVisible();
  }

  get balanceSection() {
    return this.page.locator('.report-section').filter({ hasText: 'Balanceamento de Esforço' });
  }

  get performanceSection() {
    return this.page.locator('.report-section').filter({ hasText: 'Desempenho por Morador' });
  }

  get myPerformanceSection() {
    return this.page.locator('.report-section').filter({ hasText: 'Meu Desempenho' });
  }

  performanceCard(memberName: string) {
    return this.page.locator('.perf-card').filter({ hasText: memberName });
  }

  balanceCard(memberName: string) {
    return this.page.locator('.balance-card').filter({ hasText: memberName });
  }
}
