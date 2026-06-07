import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/client';

const mock = new MockAdapter(apiClient);

describe('apiClient', () => {
  beforeEach(() => {
    mock.reset();
    localStorage.clear();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('request interceptor', () => {
    it('adds Authorization header when token exists in localStorage', async () => {
      localStorage.setItem('token', 'my-jwt-token');
      mock.onGet('/ping').reply(200, {});
      await apiClient.get('/ping');
      expect(mock.history.get[0].headers?.['Authorization']).toBe('Bearer my-jwt-token');
    });

    it('does not add Authorization header when no token in localStorage', async () => {
      mock.onGet('/ping').reply(200, {});
      await apiClient.get('/ping');
      expect(mock.history.get[0].headers?.['Authorization']).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    it('passes through successful responses unchanged', async () => {
      mock.onGet('/data').reply(200, { value: 42 });
      const res = await apiClient.get('/data');
      expect(res.data).toEqual({ value: 42 });
    });

    it('rejects with error.response.data.error message on API error', async () => {
      mock.onGet('/fail').reply(400, { error: 'Recurso não encontrado' });
      await expect(apiClient.get('/fail')).rejects.toThrow('Recurso não encontrado');
    });

    it('rejects with error.message when no error body', async () => {
      mock.onGet('/fail').networkError();
      await expect(apiClient.get('/fail')).rejects.toThrow();
    });

    it('falls back to default message when error has no details', async () => {
      const handlers = (apiClient.interceptors.response as any).handlers as Array<{ fulfilled: unknown; rejected: (e: unknown) => unknown }>;
      const lastHandler = handlers[handlers.length - 1];
      const fakeError = { response: { data: {} }, message: '' };
      await expect(lastHandler.rejected(fakeError)).rejects.toThrow('Ocorreu um erro inesperado.');
    });
  });
});
