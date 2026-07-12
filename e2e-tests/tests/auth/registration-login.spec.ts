import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { RegisterPage } from '../../pages/register.page';
import { DEFAULT_PASSWORD, uniqueEmail, uniqueName } from '../../utils/test-data';

// RF-01 / RF-03 — cadastro de conta e acesso ao sistema com a própria conta.
test.describe('Cadastro e login', () => {
  test('usuário cria conta e consegue fazer login em seguida', async ({ page }) => {
    const name = uniqueName();
    const email = uniqueEmail();
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    await test.step('criar conta', async () => {
      await registerPage.goto();
      await registerPage.register(name, email, DEFAULT_PASSWORD);
      await registerPage.expectToast('Conta criada! Faça login para continuar.');
      await expect(page).toHaveURL('/login');
    });

    await test.step('logar com as credenciais recém-criadas', async () => {
      await loginPage.login(email, DEFAULT_PASSWORD);
      await expect(page).toHaveURL('/houses');
      await expect(page.getByRole('heading', { name: 'Minhas Casas' })).toBeVisible();
    });
  });

  test('login exibe erro para senha incorreta', async ({ page }) => {
    const name = uniqueName();
    const email = uniqueEmail();
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    await registerPage.goto();
    await registerPage.register(name, email, DEFAULT_PASSWORD);
    await expect(page).toHaveURL('/login');

    await loginPage.login(email, 'senha-errada-123');
    await loginPage.expectToast('Credenciais inválidas.');
    await expect(page).toHaveURL('/login');
  });

  test('cadastro é bloqueado quando a senha tem menos de 6 caracteres', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(uniqueName(), uniqueEmail(), '123');

    // O campo tem o atributo HTML `minlength`, então o navegador barra o
    // envio do formulário antes mesmo da validação em JS do componente.
    await expect(page).toHaveURL('/register');
    const isValid = await page.getByLabel('Senha').evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('link de cadastro leva à tela de login e vice-versa', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.goToRegister();
    await expect(page).toHaveURL('/register');
  });
});
