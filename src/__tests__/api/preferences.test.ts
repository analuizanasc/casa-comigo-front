import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/client';
import { listPreferences, setPreference, getMemberPreferences } from '../../api/preferences';

const mock = new MockAdapter(apiClient);
const HID = 'house-1';
const TID = 'task-1';
const UID = 'user-1';

describe('preferences API', () => {
  afterAll(() => mock.restore());

  it('listPreferences sends GET /houses/:id/preferences', async () => {
    mock.onGet(`/houses/${HID}/preferences`).reply(200, []);
    const res = await listPreferences(HID);
    expect(res.data).toEqual([]);
  });

  it('setPreference sends PUT /houses/:hid/preferences/:tid', async () => {
    mock.onPut(`/houses/${HID}/preferences/${TID}`).reply(200, {});
    await setPreference(HID, TID, { preference_level: 'like', has_physical_limitation: false });
    const body = JSON.parse(mock.history.put[0].data);
    expect(body.preference_level).toBe('like');
    expect(body.has_physical_limitation).toBe(false);
  });

  it('getMemberPreferences sends GET /houses/:hid/preferences/member/:uid', async () => {
    mock.onGet(`/houses/${HID}/preferences/member/${UID}`).reply(200, []);
    const res = await getMemberPreferences(HID, UID);
    expect(res.data).toEqual([]);
  });
});
