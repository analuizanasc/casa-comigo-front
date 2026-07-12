import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { RegisterPage } from '../../pages/register.page';
import { HousesPage } from '../../pages/houses.page';
import { createHouse, registerAndLogin } from '../../fixtures/api';
import { DEFAULT_PASSWORD, uniqueEmail, uniqueHouseName, uniqueName } from '../../utils/test-data';

// RF-01 — administrador cria uma casa e convida moradores.
test.describe('Gestão de casas', () => {
  test('administrador cria uma casa e é identificado como Administrador', async ({ page }) => {
    const email = uniqueEmail();
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);
    const houseName = uniqueHouseName();

    await registerPage.goto();
    await registerPage.register(uniqueName(), email, DEFAULT_PASSWORD);
    await loginPage.goto();
    await loginPage.login(email, DEFAULT_PASSWORD);

    await housesPage.dismissOnboardingIfPresent();
    await housesPage.createHouse(houseName);
    await housesPage.expectToast('Casa criada com sucesso!');

    const card = housesPage.houseCard(houseName);
    await expect(card).toBeVisible();
    await expect(card).toContainText('Administrador');

    await housesPage.enterHouse(houseName);
    await expect(page.locator('.sub')).toHaveText(houseName);
  });

  test('morador entra em uma casa existente usando o código de convite', async ({ page, request }) => {
    const admin = await registerAndLogin(request, {
      name: uniqueName('Admin'),
      email: uniqueEmail('admin'),
      password: DEFAULT_PASSWORD,
    });
    const house = await createHouse(request, admin.token, uniqueHouseName());

    const memberEmail = uniqueEmail('morador');
    const memberPassword = DEFAULT_PASSWORD;
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const housesPage = new HousesPage(page);

    await registerPage.goto();
    await registerPage.register(uniqueName('Morador'), memberEmail, memberPassword);
    await loginPage.goto();
    await loginPage.login(memberEmail, memberPassword);
    await housesPage.dismissOnboardingIfPresent();

    await housesPage.joinHouseWithCode(house.invite_code);
    await housesPage.expectToast('Você entrou na casa!');

    const card = housesPage.houseCard(house.name);
    await expect(card).toBeVisible();
    await expect(card).toContainText('Morador');
  });
});
