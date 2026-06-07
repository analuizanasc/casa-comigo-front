import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/client';
import { login, register } from '../../api/auth';

const mock = new MockAdapter(apiClient);

describe('auth API', () => {
  beforeEach(() => mock.reset());
  afterAll(() => mock.restore());

  describe('login', () => {
    it('sends POST /auth/login with email and password', async () => {
      const payload = { token: 'tok123', user: { id: '1', name: 'Alice', email: 'a@a.com', created_at: '' } };
      mock.onPost('/auth/login').reply(200, payload);

      const res = await login('a@a.com', 'secret');

      expect(res.data).toEqual(payload);
      expect(JSON.parse(mock.history.post[0].data)).toEqual({ email: 'a@a.com', password: 'secret' });
    });
  });

  describe('register', () => {
    it('sends POST /auth/register with name, email and password', async () => {
      const payload = { message: 'Created', user: { id: '2', name: 'Bob', email: 'b@b.com', created_at: '' } };
      mock.onPost('/auth/register').reply(201, payload);

      const res = await register('Bob', 'b@b.com', 'pass123');

      expect(res.data).toEqual(payload);
      expect(JSON.parse(mock.history.post[0].data)).toEqual({ name: 'Bob', email: 'b@b.com', password: 'pass123' });
    });
  });
});
