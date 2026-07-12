import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HousesPage } from '../../pages/houses.page';
import { PreferencesPage } from '../../pages/preferences.page';
import { createHouse, createTask, registerAndLogin } from '../../fixtures/api';
import { DEFAULT_PASSWORD, uniqueEmail, uniqueHouseName, uniqueName, uniqueTaskName } from '../../utils/test-data';

// RF-10 / RF-11 — preferência em três níveis e marcação de limitação física.
test.describe('Preferências do morador', () => {
  test('morador classifica sua preferência por uma tarefa', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const task = await createTask(request, admin.token, house.id, { name: uniqueTaskName('Limpar banheiro') });

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const preferencesPage = new PreferencesPage(page);

    await loginPage.goto();
    await loginPage.login(admin.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await preferencesPage.goto();

    await preferencesPage.setPreference(task.name, 'gosto');
    await expect(preferencesPage.isPreferenceActive(task.name, 'gosto')).toHaveClass(/pref-toggle__btn--active/);

    await preferencesPage.setPreference(task.name, 'odeio');
    await expect(preferencesPage.isPreferenceActive(task.name, 'odeio')).toHaveClass(/pref-toggle__btn--active/);
    await expect(preferencesPage.isPreferenceActive(task.name, 'gosto')).not.toHaveClass(/pref-toggle__btn--active/);
  });

  test('morador marca limitação física para uma tarefa', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const task = await createTask(request, admin.token, house.id, { name: uniqueTaskName('Carregar peso') });

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const preferencesPage = new PreferencesPage(page);

    await loginPage.goto();
    await loginPage.login(admin.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await preferencesPage.goto();

    await preferencesPage.toggleLimitation(task.name, true);
    await expect(preferencesPage.limitationCheckbox(task.name)).toBeChecked();
    await expect(preferencesPage.prefCard(task.name)).toContainText('🚫 Limitação física');

    await preferencesPage.toggleLimitation(task.name, false);
    await expect(preferencesPage.limitationCheckbox(task.name)).not.toBeChecked();
  });

  test('busca filtra tarefas por nome no painel de preferências', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const matchingTask = await createTask(request, admin.token, house.id, { name: uniqueTaskName('Aspirar tapete') });
    const otherTask = await createTask(request, admin.token, house.id, { name: uniqueTaskName('Organizar armário') });

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const preferencesPage = new PreferencesPage(page);

    await loginPage.goto();
    await loginPage.login(admin.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await preferencesPage.goto();

    await preferencesPage.search('Aspirar tapete');
    await expect(preferencesPage.prefCard(matchingTask.name)).toBeVisible();
    await expect(preferencesPage.prefCard(otherTask.name)).toHaveCount(0);
  });
});
