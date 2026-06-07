import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/client';
import { distribute, getSchedule, getAssignment, reassignTask, completeTask, reportImpediment } from '../../api/schedule';

const mock = new MockAdapter(apiClient);
const HID = 'house-1';
const AID = 'assignment-1';

describe('schedule API', () => {
  beforeEach(() => mock.reset());
  afterAll(() => mock.restore());

  it('distribute sends POST /houses/:id/schedule/distribute', async () => {
    mock.onPost(`/houses/${HID}/schedule/distribute`).reply(200, { total_tasks_assigned: 5 });
    const res = await distribute(HID, { period_start: '2024-01-01', period_end: '2024-01-31' });
    expect(res.data.total_tasks_assigned).toBe(5);
  });

  it('getSchedule sends GET /houses/:id/schedule with params', async () => {
    mock.onGet(`/houses/${HID}/schedule`).reply(200, []);
    const res = await getSchedule(HID, { date_from: '2024-01-01', date_to: '2024-01-31', assigned_to: 'u1' });
    expect(res.data).toEqual([]);
  });

  it('getSchedule works without params', async () => {
    mock.onGet(`/houses/${HID}/schedule`).reply(200, []);
    const res = await getSchedule(HID);
    expect(res.data).toEqual([]);
  });

  it('getAssignment sends GET /houses/:hid/schedule/:aid', async () => {
    mock.onGet(`/houses/${HID}/schedule/${AID}`).reply(200, { id: AID });
    const res = await getAssignment(HID, AID);
    expect(res.data.id).toBe(AID);
  });

  it('reassignTask sends PUT /houses/:hid/schedule/:aid/reassign', async () => {
    mock.onPut(`/houses/${HID}/schedule/${AID}/reassign`).reply(200, { id: AID });
    await reassignTask(HID, AID, { assigned_to: 'user-2' });
    expect(JSON.parse(mock.history.put[0].data)).toEqual({ assigned_to: 'user-2' });
  });

  it('completeTask sends PATCH /houses/:hid/schedule/:aid/complete', async () => {
    mock.onPatch(`/houses/${HID}/schedule/${AID}/complete`).reply(200, { id: AID });
    await completeTask(HID, AID, 'Tudo certo!');
    expect(JSON.parse(mock.history.patch[0].data)).toEqual({ completion_notes: 'Tudo certo!' });
  });

  it('completeTask sends PATCH without notes when undefined', async () => {
    mock.onPatch(`/houses/${HID}/schedule/${AID}/complete`).reply(200, { id: AID });
    await completeTask(HID, AID);
    const body = JSON.parse(mock.history.patch[0].data);
    expect(body.completion_notes).toBeUndefined();
  });

  it('reportImpediment sends PATCH /houses/:hid/schedule/:aid/impediment', async () => {
    mock.onPatch(`/houses/${HID}/schedule/${AID}/impediment`).reply(200, { message: 'redistributed', new_assignment: {} });
    const res = await reportImpediment(HID, AID);
    expect(res.data.message).toBe('redistributed');
  });
});
