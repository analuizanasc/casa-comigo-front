import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/client';
import { listMembers, inviteMember, getWeights, updateRole, updateWeight, updateAvailability, removeMember } from '../../api/members';

const mock = new MockAdapter(apiClient);
const HID = 'house-1';
const UID = 'user-1';

describe('members API', () => {
  beforeEach(() => mock.reset());
  afterAll(() => mock.restore());

  it('listMembers sends GET /houses/:id/members', async () => {
    mock.onGet(`/houses/${HID}/members`).reply(200, [{ id: 'm1' }]);
    const res = await listMembers(HID);
    expect(res.data).toHaveLength(1);
  });

  it('inviteMember sends POST /houses/:id/members/invite', async () => {
    mock.onPost(`/houses/${HID}/members/invite`).reply(200, {});
    await inviteMember(HID, 'new@test.com');
    expect(JSON.parse(mock.history.post[0].data)).toEqual({ email: 'new@test.com' });
  });

  it('getWeights sends GET /houses/:id/members/weights', async () => {
    mock.onGet(`/houses/${HID}/members/weights`).reply(200, { members: [] });
    const res = await getWeights(HID);
    expect(res.data.members).toEqual([]);
  });

  it('updateRole sends PUT /houses/:hid/members/:uid/role', async () => {
    mock.onPut(`/houses/${HID}/members/${UID}/role`).reply(200, { message: 'ok' });
    const res = await updateRole(HID, UID, 'admin');
    expect(JSON.parse(mock.history.put[0].data)).toEqual({ role: 'admin' });
    expect(res.data.message).toBe('ok');
  });

  it('updateWeight sends PUT /houses/:hid/members/:uid/weight', async () => {
    mock.onPut(`/houses/${HID}/members/${UID}/weight`).reply(200, { message: 'ok', total_weight: 100 });
    const res = await updateWeight(HID, UID, 40);
    expect(JSON.parse(mock.history.put[0].data)).toEqual({ weight_percentage: 40 });
    expect(res.data.total_weight).toBe(100);
  });

  it('updateAvailability sends PUT /houses/:hid/members/:uid/availability', async () => {
    mock.onPut(`/houses/${HID}/members/${UID}/availability`).reply(200, { message: 'ok' });
    const res = await updateAvailability(HID, UID, 8);
    expect(JSON.parse(mock.history.put[0].data)).toEqual({ weekly_availability_hours: 8 });
    expect(res.data.message).toBe('ok');
  });

  it('removeMember sends DELETE /houses/:hid/members/:uid', async () => {
    mock.onDelete(`/houses/${HID}/members/${UID}`).reply(200, { message: 'removed' });
    const res = await removeMember(HID, UID);
    expect(res.data.message).toBe('removed');
  });
});
