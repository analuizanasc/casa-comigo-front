import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/client';
import { createHouse, getMyHouses, joinHouse, getHouse, updateTolerance } from '../../api/houses';

const mock = new MockAdapter(apiClient);

describe('houses API', () => {
  beforeEach(() => mock.reset());
  afterAll(() => mock.restore());

  it('createHouse sends POST /houses with name', async () => {
    mock.onPost('/houses').reply(201, { id: 'h1', name: 'Casa A' });
    const res = await createHouse('Casa A');
    expect(res.data.name).toBe('Casa A');
    expect(JSON.parse(mock.history.post[0].data)).toEqual({ name: 'Casa A' });
  });

  it('getMyHouses sends GET /houses/me', async () => {
    mock.onGet('/houses/me').reply(200, [{ id: 'h1' }]);
    const res = await getMyHouses();
    expect(res.data).toHaveLength(1);
  });

  it('joinHouse sends POST /houses/join with invite_code', async () => {
    mock.onPost('/houses/join').reply(200, { id: 'h2' });
    const res = await joinHouse('ABC123');
    expect(JSON.parse(mock.history.post[0].data)).toEqual({ invite_code: 'ABC123' });
    expect(res.data.id).toBe('h2');
  });

  it('getHouse sends GET /houses/:id', async () => {
    mock.onGet('/houses/h1').reply(200, { id: 'h1', name: 'Casa A' });
    const res = await getHouse('h1');
    expect(res.data.id).toBe('h1');
  });

  it('updateTolerance sends PATCH /houses/:id/tolerance', async () => {
    mock.onPatch('/houses/h1/tolerance').reply(200, { message: 'ok' });
    const res = await updateTolerance('h1', 15);
    expect(JSON.parse(mock.history.patch[0].data)).toEqual({ tolerance_percentage: 15 });
    expect(res.data.message).toBe('ok');
  });
});
