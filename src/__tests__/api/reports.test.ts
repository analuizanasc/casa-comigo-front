import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/client';
import { getPerformanceReport, getBalanceReport } from '../../api/reports';

const mock = new MockAdapter(apiClient);
const HID = 'house-1';

describe('reports API', () => {
  afterAll(() => mock.restore());

  it('getPerformanceReport sends GET /houses/:id/reports/performance', async () => {
    mock.onGet(`/houses/${HID}/reports/performance`).reply(200, { period: {}, members: [] });
    const res = await getPerformanceReport(HID, { date_from: '2024-01-01', date_to: '2024-01-31' });
    expect(res.data.members).toEqual([]);
  });

  it('getPerformanceReport works without params', async () => {
    mock.onGet(`/houses/${HID}/reports/performance`).reply(200, { period: {}, members: [] });
    const res = await getPerformanceReport(HID);
    expect(res.data).toBeDefined();
  });

  it('getBalanceReport sends GET /houses/:id/reports/balance', async () => {
    mock.onGet(`/houses/${HID}/reports/balance`).reply(200, { within_tolerance: true, members: [] });
    const res = await getBalanceReport(HID);
    expect(res.data.within_tolerance).toBe(true);
  });
});
