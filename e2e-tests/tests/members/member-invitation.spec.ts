import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HousesPage } from '../../pages/houses.page';
import { MembersPage } from '../../pages/members.page';
import { acceptPendingInvitation, createHouse, inviteMember, registerAndLogin } from '../../fixtures/api';
import { DEFAULT_PASSWORD, uniqueEmail, uniqueHouseName, uniqueName } from '../../utils/test-data';

// RF-01 (convite por e-mail), RF-02 (edição de perfil), RF-04/RF-05 (concessão e
// revogação da permissão de Gestor de Catálogo).
test.describe('Convite e gestão de membros', () => {
  test('morador convidado por e-mail aceita o convite e passa a ver a casa', async ({ browser, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());

    const memberName = uniqueName('Convidado');
    const memberEmail = uniqueEmail('convidado');
    await registerAndLogin(request, { name: memberName, email: memberEmail, password: DEFAULT_PASSWORD });

    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const memberContext = await browser.newContext();
    const memberPage = await memberContext.newPage();

    try {
      await test.step('admin convida o morador pela tela de Membros', async () => {
        const loginPage = new LoginPage(adminPage);
        const housesPage = new HousesPage(adminPage);
        const membersPage = new MembersPage(adminPage);

        await loginPage.goto();
        await loginPage.login(admin.email, DEFAULT_PASSWORD);
        await housesPage.dismissOnboardingIfPresent();
        await housesPage.enterHouse(house.name);
        await membersPage.goto();
        await membersPage.inviteMember(memberEmail);
        await membersPage.expectToast('Convite enviado! O usuário verá a notificação na tela inicial.');
      });

      await test.step('morador convidado aceita o convite', async () => {
        const loginPage = new LoginPage(memberPage);
        const housesPage = new HousesPage(memberPage);

        await loginPage.goto();
        await loginPage.login(memberEmail, DEFAULT_PASSWORD);
        await housesPage.dismissOnboardingIfPresent();
        await expect(housesPage.invitationCard(house.name)).toBeVisible();

        await housesPage.acceptInvitation(house.name);
        await expect(memberPage.getByText('Convite aceito. Você entrou na casa.')).toBeVisible();
        await expect(housesPage.houseCard(house.name)).toBeVisible();
      });

      await test.step('admin vê o novo morador na lista de membros', async () => {
        const membersPage = new MembersPage(adminPage);
        await adminPage.reload();
        await expect(membersPage.memberCard(memberName)).toBeVisible();
        await expect(membersPage.memberCard(memberName)).toContainText('Morador');
      });
    } finally {
      await adminContext.close();
      await memberContext.close();
    }
  });

  test('admin concede permissão de Gestor de Catálogo e define peso/disponibilidade', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());

    const memberName = uniqueName('Morador');
    const memberEmail = uniqueEmail('morador');
    const member = await registerAndLogin(request, { name: memberName, email: memberEmail, password: DEFAULT_PASSWORD });

    await inviteMember(request, admin.token, house.id, memberEmail);
    await acceptPendingInvitation(request, member.token, house.name);

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const membersPage = new MembersPage(page);

    await loginPage.goto();
    await loginPage.login(admin.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await membersPage.goto();

    await membersPage.openEdit(memberName);
    await membersPage.setRole('Gestor de Catálogo');
    await membersPage.setWeight(40);
    await membersPage.setAvailability(12);
    await membersPage.saveEdit();
    await membersPage.expectToast('Membro atualizado!');

    const card = membersPage.memberCard(memberName);
    await expect(card).toContainText('Gestor de Catálogo');
    await expect(card).toContainText('40%');
    await expect(card).toContainText('12h/sem');
  });

  test('admin remove um morador da casa', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());

    const memberName = uniqueName('Removivel');
    const memberEmail = uniqueEmail('removivel');
    const member = await registerAndLogin(request, { name: memberName, email: memberEmail, password: DEFAULT_PASSWORD });

    await inviteMember(request, admin.token, house.id, memberEmail);
    await acceptPendingInvitation(request, member.token, house.name);

    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const membersPage = new MembersPage(page);

    await loginPage.goto();
    await loginPage.login(admin.email, DEFAULT_PASSWORD);
    await housesPage.dismissOnboardingIfPresent();
    await housesPage.enterHouse(house.name);
    await membersPage.goto();

    await expect(membersPage.memberCard(memberName)).toBeVisible();
    await membersPage.removeMember(memberName);
    await membersPage.expectToast('Membro removido.');
    await expect(membersPage.memberCard(memberName)).toHaveCount(0);
  });
});
