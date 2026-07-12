import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HousesPage } from '../../pages/houses.page';
import { ReportsPage } from '../../pages/reports.page';
import {
  acceptPendingInvitation,
  createHouse,
  createTask,
  distribute,
  inviteMember,
  registerAndLogin,
} from '../../fixtures/api';
import { DEFAULT_PASSWORD, isoDateOffset, uniqueEmail, uniqueHouseName, uniqueName, uniqueTaskName } from '../../utils/test-data';

// RF-32 — relatórios de desempenho por morador (admin) e desempenho próprio (morador).
test.describe('Relatórios de desempenho', () => {
  test('admin visualiza balanceamento e desempenho por morador', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const resident = await registerAndLogin(request, {
      name: uniqueName('Residente'),
      email: uniqueEmail('residente'),
      password: DEFAULT_PASSWORD,
    });
    await inviteMember(request, admin.token, house.id, resident.email);
    await acceptPendingInvitation(request, resident.token, house.name);
    await createTask(request, admin.token, house.id, { name: uniqueTaskName('Lavar carro') });
    await distribute(request, admin.token, house.id, {
      period_start: isoDateOffset(0),
      period_end: isoDateOffset(14),
    });

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const reportsPage = new ReportsPage(page);

    await loginPage.goto();
    await loginPage.login(admin.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await reportsPage.goto();

    await expect(reportsPage.balanceSection).toBeVisible();
    await expect(reportsPage.balanceCard(admin.name)).toBeVisible();
    await expect(reportsPage.balanceCard(resident.name)).toBeVisible();

    await expect(reportsPage.performanceSection).toBeVisible();
    await expect(reportsPage.performanceCard(admin.name)).toBeVisible();
    await expect(reportsPage.performanceCard(resident.name)).toBeVisible();
  });

  test('morador não tem caminho de navegação até a tela de Relatórios (RF-32)', async ({ page, request }) => {
    // Defeito conhecido: a sidebar só linka "Relatórios" para o papel admin
    // (Sidebar.tsx navItems). O RF-32 exige que o morador veja o próprio
    // desempenho, mas hoje não há nenhum link/ação in-app que o leve até lá —
    // a tela só é alcançável digitando a URL manualmente. Este teste replica
    // a jornada real (entrar na casa e navegar pela sidebar) e deve falhar
    // até que um link para moradores seja adicionado.
    test.fail();

    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const resident = await registerAndLogin(request, {
      name: uniqueName('Residente'),
      email: uniqueEmail('residente'),
      password: DEFAULT_PASSWORD,
    });
    await inviteMember(request, admin.token, house.id, resident.email);
    await acceptPendingInvitation(request, resident.token, house.name);

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const reportsPage = new ReportsPage(page);

    await loginPage.goto();
    await loginPage.login(resident.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);

    await expect(reportsPage.sidebarLink).toBeVisible();

    await reportsPage.goto();
    await expect(reportsPage.myPerformanceSection).toBeVisible();
  });

  test('conteúdo de Relatórios exibe o próprio desempenho do morador quando a tela é aberta', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const resident = await registerAndLogin(request, {
      name: uniqueName('Residente'),
      email: uniqueEmail('residente'),
      password: DEFAULT_PASSWORD,
    });
    await inviteMember(request, admin.token, house.id, resident.email);
    await acceptPendingInvitation(request, resident.token, house.name);
    await createTask(request, admin.token, house.id, { name: uniqueTaskName('Limpar geladeira') });
    await distribute(request, admin.token, house.id, {
      period_start: isoDateOffset(0),
      period_end: isoDateOffset(14),
    });

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const reportsPage = new ReportsPage(page);

    await loginPage.goto();
    await loginPage.login(resident.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await reportsPage.gotoDirect(house.id);

    await expect(reportsPage.myPerformanceSection).toBeVisible();
    await expect(reportsPage.performanceCard(resident.name)).toBeVisible();
    await expect(reportsPage.balanceSection).toHaveCount(0);
  });
});
