import { test, expect, type APIRequestContext } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HousesPage } from '../../pages/houses.page';
import { SchedulePage } from '../../pages/schedule.page';
import {
  acceptPendingInvitation,
  createHouse,
  createTask,
  distribute,
  getSchedule,
  inviteMember,
  registerAndLogin,
  type ApiAssignment,
  type RegisteredUser,
} from '../../fixtures/api';
import { DEFAULT_PASSWORD, isoDateOffset, uniqueEmail, uniqueHouseName, uniqueName, uniqueTaskName } from '../../utils/test-data';

// RF-14/15/17 (distribuição e painel de balanceamento), RF-18 (troca manual),
// RF-19 (redistribuição por impedimento), RF-30/31 (conclusão com observação).

async function setupHouseWithTwoResidents(request: APIRequestContext) {
  const admin = await registerAndLogin(request, {
    name: uniqueName('Admin'),
    email: uniqueEmail('admin'),
    password: DEFAULT_PASSWORD,
  });
  const house = await createHouse(request, admin.token, uniqueHouseName());

  const residentA = await registerAndLogin(request, {
    name: uniqueName('Residente A'),
    email: uniqueEmail('residente-a'),
    password: DEFAULT_PASSWORD,
  });
  const residentB = await registerAndLogin(request, {
    name: uniqueName('Residente B'),
    email: uniqueEmail('residente-b'),
    password: DEFAULT_PASSWORD,
  });

  await inviteMember(request, admin.token, house.id, residentA.email);
  await acceptPendingInvitation(request, residentA.token, house.name);
  await inviteMember(request, admin.token, house.id, residentB.email);
  await acceptPendingInvitation(request, residentB.token, house.name);

  return { admin, house, residentA, residentB };
}

function findCredentialsForUserId(
  userId: string,
  users: RegisteredUser[]
): RegisteredUser {
  const match = users.find((u) => u.userId === userId);
  if (!match) throw new Error(`Nenhuma credencial encontrada para o usuário ${userId}`);
  return match;
}

function findEarliestAssignment(assignments: ApiAssignment[], taskName: string): ApiAssignment | undefined {
  return assignments
    .filter((a) => a.task_name === taskName)
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))[0];
}

test.describe('Distribuição e execução do cronograma', () => {
  test('admin gera distribuição automática e revisa o balanceamento', async ({ page, request }) => {
    const { admin, house } = await setupHouseWithTwoResidents(request);
    await createTask(request, admin.token, house.id, { name: uniqueTaskName('Lavar louça') });
    await createTask(request, admin.token, house.id, { name: uniqueTaskName('Tirar lixo') });

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const schedulePage = new SchedulePage(page);

    await loginPage.goto();
    await loginPage.login(admin.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await schedulePage.goto();

    await schedulePage.openDistribute();
    await schedulePage.runDistribution(isoDateOffset(0), isoDateOffset(14));
    await expect(schedulePage.distributionResultStatus).toBeVisible();
    await expect(schedulePage.distributionBalanceItems).toHaveCount(3);

    await schedulePage.closeDistributionResult();
    await schedulePage.setDateFilter(isoDateOffset(0), isoDateOffset(14));
    await expect(page.locator('.assignment-card').first()).toBeVisible();
  });

  test('morador conclui uma tarefa atribuída a ele com uma observação', async ({ page, request }) => {
    const { admin, house, residentA, residentB } = await setupHouseWithTwoResidents(request);
    const task = await createTask(request, admin.token, house.id, { name: uniqueTaskName('Regar jardim') });

    const periodStart = isoDateOffset(0);
    const periodEnd = isoDateOffset(14);
    await distribute(request, admin.token, house.id, { period_start: periodStart, period_end: periodEnd });

    const assignments = await getSchedule(request, admin.token, house.id, {
      date_from: periodStart,
      date_to: periodEnd,
    });
    const assignment = findEarliestAssignment(assignments, task.name);
    expect(assignment).toBeDefined();
    const actor = findCredentialsForUserId(assignment!.assigned_to, [admin, residentA, residentB]);

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const schedulePage = new SchedulePage(page);

    await loginPage.goto();
    await loginPage.login(actor.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await schedulePage.goto();
    await schedulePage.setDateFilter(periodStart, periodEnd);

    await schedulePage.completeTask(task.name, 'Produto de limpeza acabou.');
    await schedulePage.expectToast('Tarefa concluída!');
    await expect(schedulePage.assignmentCard(task.name)).toContainText('Concluída');
    await expect(schedulePage.assignmentCard(task.name)).toContainText('Produto de limpeza acabou.');
  });

  test('morador reporta impedimento e a tarefa é redistribuída', async ({ page, request }) => {
    const { admin, house, residentA, residentB } = await setupHouseWithTwoResidents(request);
    const task = await createTask(request, admin.token, house.id, { name: uniqueTaskName('Passar roupa') });

    const periodStart = isoDateOffset(0);
    const periodEnd = isoDateOffset(14);
    await distribute(request, admin.token, house.id, { period_start: periodStart, period_end: periodEnd });

    const assignments = await getSchedule(request, admin.token, house.id, {
      date_from: periodStart,
      date_to: periodEnd,
    });
    const assignment = findEarliestAssignment(assignments, task.name);
    expect(assignment).toBeDefined();
    const actor = findCredentialsForUserId(assignment!.assigned_to, [admin, residentA, residentB]);

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const schedulePage = new SchedulePage(page);

    await loginPage.goto();
    await loginPage.login(actor.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await schedulePage.goto();
    await schedulePage.setDateFilter(periodStart, periodEnd);

    await schedulePage.reportImpediment(task.name);
    await schedulePage.expectToast('Tarefa redistribuída com sucesso.');
  });

  test('admin reatribui manualmente uma tarefa para outro morador', async ({ page, request }) => {
    const { admin, house, residentA, residentB } = await setupHouseWithTwoResidents(request);
    const task = await createTask(request, admin.token, house.id, { name: uniqueTaskName('Organizar despensa') });

    const periodStart = isoDateOffset(0);
    const periodEnd = isoDateOffset(14);
    await distribute(request, admin.token, house.id, { period_start: periodStart, period_end: periodEnd });

    const assignments = await getSchedule(request, admin.token, house.id, {
      date_from: periodStart,
      date_to: periodEnd,
    });
    const assignment = findEarliestAssignment(assignments, task.name);
    expect(assignment).toBeDefined();

    const allMembers = [admin, residentA, residentB];
    const target = allMembers.find((m) => m.userId !== assignment!.assigned_to);
    expect(target).toBeDefined();

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const schedulePage = new SchedulePage(page);

    await loginPage.goto();
    await loginPage.login(admin.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await schedulePage.goto();
    await schedulePage.setDateFilter(periodStart, periodEnd);

    await schedulePage.reassignTask(task.name, target!.name);
    await expect(schedulePage.assignmentCard(task.name)).toContainText(target!.name);
  });
});
