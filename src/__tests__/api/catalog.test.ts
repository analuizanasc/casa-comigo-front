import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/client';
import { listTasks, createTask, getTask, updateTask, deleteTask, addDependency, removeDependency } from '../../api/catalog';

const mock = new MockAdapter(apiClient);
const HID = 'house-1';
const TID = 'task-1';

describe('catalog API', () => {
  beforeEach(() => mock.reset());
  afterAll(() => mock.restore());

  it('listTasks sends GET /houses/:id/catalog', async () => {
    mock.onGet(`/houses/${HID}/catalog`).reply(200, [{ id: TID }]);
    const res = await listTasks(HID);
    expect(res.data).toHaveLength(1);
  });

  it('createTask sends POST /houses/:id/catalog', async () => {
    mock.onPost(`/houses/${HID}/catalog`).reply(201, { id: TID });
    const res = await createTask(HID, { name: 'Varrer', frequency: 'weekly', effort_level: 'light' });
    expect(res.data.id).toBe(TID);
  });

  it('getTask sends GET /houses/:hid/catalog/:tid', async () => {
    mock.onGet(`/houses/${HID}/catalog/${TID}`).reply(200, { id: TID, dependencies: [], dependents: [] });
    const res = await getTask(HID, TID);
    expect(res.data.dependencies).toEqual([]);
  });

  it('updateTask sends PUT /houses/:hid/catalog/:tid', async () => {
    mock.onPut(`/houses/${HID}/catalog/${TID}`).reply(200, { id: TID });
    await updateTask(HID, TID, { name: 'Novo', frequency: 'daily', effort_level: 'medium' });
    expect(JSON.parse(mock.history.put[0].data).name).toBe('Novo');
  });

  it('deleteTask sends DELETE /houses/:hid/catalog/:tid', async () => {
    mock.onDelete(`/houses/${HID}/catalog/${TID}`).reply(200, { message: 'deleted' });
    const res = await deleteTask(HID, TID);
    expect(res.data.message).toBe('deleted');
  });

  it('addDependency sends POST .../dependencies', async () => {
    mock.onPost(`/houses/${HID}/catalog/${TID}/dependencies`).reply(201, { message: 'ok' });
    await addDependency(HID, TID, 'task-2');
    expect(JSON.parse(mock.history.post[0].data)).toEqual({ depends_on_task_id: 'task-2' });
  });

  it('removeDependency sends DELETE .../dependencies/:depId', async () => {
    mock.onDelete(`/houses/${HID}/catalog/${TID}/dependencies/task-2`).reply(200, { message: 'ok' });
    const res = await removeDependency(HID, TID, 'task-2');
    expect(res.data.message).toBe('ok');
  });
});
