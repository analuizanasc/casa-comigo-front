import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HousesPage } from '../../pages/houses.page';
import { CatalogPage } from '../../pages/catalog.page';
import { createHouse, registerAndLogin } from '../../fixtures/api';
import { DEFAULT_PASSWORD, uniqueEmail, uniqueHouseName, uniqueName, uniqueTaskName } from '../../utils/test-data';

// RF-07 / RF-08 — CRUD de tarefas personalizadas com atributos e dependências de ordem.
test.describe('Catálogo de tarefas', () => {
  async function loginIntoHouse(page: import('@playwright/test').Page, email: string, houseName: string) {
    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    await loginPage.goto();
    await loginPage.login(email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(houseName);
  }

  test('admin cria uma tarefa personalizada com seus atributos', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const taskName = uniqueTaskName();

    await loginIntoHouse(page, admin.email, house.name);
    const catalogPage = new CatalogPage(page);
    await catalogPage.goto();

    await catalogPage.createTask({
      name: taskName,
      description: 'Lavar e guardar a louça após o jantar',
      frequency: 'Diária',
      effort: 'Leve',
      durationMinutes: 15,
      room: 'Cozinha',
    });
    await catalogPage.expectToast('Tarefa criada!');

    const card = catalogPage.taskCard(taskName);
    await expect(card).toBeVisible();
    await expect(card).toContainText('Cozinha');
    await expect(card).toContainText('Leve');
    await expect(card).toContainText('15min');
  });

  test('admin edita uma tarefa existente', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const taskName = uniqueTaskName();

    await loginIntoHouse(page, admin.email, house.name);
    const catalogPage = new CatalogPage(page);
    await catalogPage.goto();
    await catalogPage.createTask({ name: taskName, effort: 'Leve' });
    await catalogPage.expectToast('Tarefa criada!');

    await catalogPage.openEditTask(taskName);
    await catalogPage.fillTaskForm({ name: taskName, effort: 'Pesado', room: 'Quintal' });
    await catalogPage.submitTaskForm('edit');
    await catalogPage.expectToast('Tarefa atualizada!');

    const card = catalogPage.taskCard(taskName);
    await expect(card).toContainText('Pesado');
    await expect(card).toContainText('Quintal');
  });

  test('admin configura dependência de ordem entre duas tarefas', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const firstTask = uniqueTaskName('Lavar chão');
    const secondTask = uniqueTaskName('Passar pano');

    await loginIntoHouse(page, admin.email, house.name);
    const catalogPage = new CatalogPage(page);
    await catalogPage.goto();

    await catalogPage.createTask({ name: firstTask, effort: 'Leve' });
    await catalogPage.expectToast('Tarefa criada!');
    await catalogPage.createTask({ name: secondTask, effort: 'Leve' });
    await catalogPage.expectToast('Tarefa criada!');

    await catalogPage.openDependencies(secondTask);
    await catalogPage.addDependency(firstTask);
    await catalogPage.expectToast('Dependência adicionada!');
    await expect(catalogPage.dependencyItem(firstTask)).toBeVisible();

    await catalogPage.removeDependency(firstTask);
    await catalogPage.expectToast('Dependência removida.');
    await expect(page.getByText('Nenhuma dependência definida.')).toBeVisible();
  });

  test('admin remove uma tarefa do catálogo', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const taskName = uniqueTaskName();

    await loginIntoHouse(page, admin.email, house.name);
    const catalogPage = new CatalogPage(page);
    await catalogPage.goto();
    await catalogPage.createTask({ name: taskName, effort: 'Leve' });
    await catalogPage.expectToast('Tarefa criada!');

    await catalogPage.deleteTask(taskName);
    await catalogPage.expectToast('Tarefa removida.');
    await expect(catalogPage.taskCard(taskName)).toHaveCount(0);
  });

  test('busca filtra tarefas por nome', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());
    const matchingTask = uniqueTaskName('Regar plantas');
    const otherTask = uniqueTaskName('Trocar lençóis');

    await loginIntoHouse(page, admin.email, house.name);
    const catalogPage = new CatalogPage(page);
    await catalogPage.goto();
    await catalogPage.createTask({ name: matchingTask, effort: 'Leve' });
    await catalogPage.expectToast('Tarefa criada!');
    await catalogPage.createTask({ name: otherTask, effort: 'Leve' });
    await catalogPage.expectToast('Tarefa criada!');

    await catalogPage.search('Regar plantas');
    await expect(catalogPage.taskCard(matchingTask)).toBeVisible();
    await expect(catalogPage.taskCard(otherTask)).toHaveCount(0);
  });
});
