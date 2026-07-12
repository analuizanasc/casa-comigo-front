import type { APIRequestContext } from '@playwright/test';

export interface RegisteredUser {
  name: string;
  email: string;
  password: string;
  token: string;
  userId: string;
}

export interface CreatedHouse {
  id: string;
  name: string;
  invite_code: string;
}

/**
 * Thin wrapper around the real Casa Comigo API (no mocks) used to seed
 * prerequisite state for a test so the UI-driven steps can focus on the
 * behavior actually under test.
 */
export async function registerAndLogin(
  request: APIRequestContext,
  { name, email, password }: { name: string; email: string; password: string }
): Promise<RegisteredUser> {
  const registerRes = await request.post('/api/auth/register', {
    data: { name, email, password },
  });
  if (!registerRes.ok()) {
    throw new Error(`Falha ao registrar usuário: ${registerRes.status()} ${await registerRes.text()}`);
  }

  const loginRes = await request.post('/api/auth/login', { data: { email, password } });
  if (!loginRes.ok()) {
    throw new Error(`Falha ao logar usuário: ${loginRes.status()} ${await loginRes.text()}`);
  }
  const body = await loginRes.json();
  return { name, email, password, token: body.token, userId: body.user.id };
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function createHouse(
  request: APIRequestContext,
  token: string,
  name: string
): Promise<CreatedHouse> {
  const res = await request.post('/api/houses', {
    headers: authHeaders(token),
    data: { name },
  });
  if (!res.ok()) {
    throw new Error(`Falha ao criar casa: ${res.status()} ${await res.text()}`);
  }
  return res.json();
}

export async function inviteMember(
  request: APIRequestContext,
  token: string,
  houseId: string,
  email: string
) {
  const res = await request.post(`/api/houses/${houseId}/members/invite`, {
    headers: authHeaders(token),
    data: { email },
  });
  if (!res.ok()) {
    throw new Error(`Falha ao convidar membro: ${res.status()} ${await res.text()}`);
  }
  return res.json();
}

export async function acceptPendingInvitation(
  request: APIRequestContext,
  token: string,
  houseName: string
) {
  const listRes = await request.get('/api/invitations', { headers: authHeaders(token) });
  if (!listRes.ok()) {
    throw new Error(`Falha ao listar convites: ${listRes.status()} ${await listRes.text()}`);
  }
  const invitations: { id: string; house_name: string }[] = await listRes.json();
  const invitation = invitations.find((i) => i.house_name === houseName);
  if (!invitation) {
    throw new Error(`Convite para a casa "${houseName}" não encontrado.`);
  }
  const acceptRes = await request.post(`/api/invitations/${invitation.id}/accept`, {
    headers: authHeaders(token),
  });
  if (!acceptRes.ok()) {
    throw new Error(`Falha ao aceitar convite: ${acceptRes.status()} ${await acceptRes.text()}`);
  }
  return acceptRes.json();
}

export async function createTask(
  request: APIRequestContext,
  token: string,
  houseId: string,
  data: {
    name: string;
    description?: string;
    frequency?: string;
    duration_minutes?: number;
    effort_level?: string;
    room?: string;
  }
) {
  const res = await request.post(`/api/houses/${houseId}/catalog`, {
    headers: authHeaders(token),
    data: {
      frequency: 'weekly',
      duration_minutes: 30,
      effort_level: 'medium',
      ...data,
    },
  });
  if (!res.ok()) {
    throw new Error(`Falha ao criar tarefa: ${res.status()} ${await res.text()}`);
  }
  return res.json();
}

export async function setPreference(
  request: APIRequestContext,
  token: string,
  houseId: string,
  taskId: string,
  data: { preference_level: string; has_physical_limitation?: boolean }
) {
  const res = await request.put(`/api/houses/${houseId}/preferences/${taskId}`, {
    headers: authHeaders(token),
    data,
  });
  if (!res.ok()) {
    throw new Error(`Falha ao definir preferência: ${res.status()} ${await res.text()}`);
  }
  return res.json();
}

export async function distribute(
  request: APIRequestContext,
  token: string,
  houseId: string,
  data: { period_start: string; period_end: string }
) {
  const res = await request.post(`/api/houses/${houseId}/schedule/distribute`, {
    headers: authHeaders(token),
    data,
  });
  if (!res.ok()) {
    throw new Error(`Falha ao distribuir tarefas: ${res.status()} ${await res.text()}`);
  }
  return res.json();
}

export interface ApiAssignment {
  id: string;
  task_id: string;
  task_name: string;
  assigned_to: string;
  assigned_to_name: string;
  scheduled_date: string;
  status: string;
}

export async function getSchedule(
  request: APIRequestContext,
  token: string,
  houseId: string,
  params: { date_from: string; date_to: string }
): Promise<ApiAssignment[]> {
  const res = await request.get(`/api/houses/${houseId}/schedule`, {
    headers: authHeaders(token),
    params,
  });
  if (!res.ok()) {
    throw new Error(`Falha ao buscar cronograma: ${res.status()} ${await res.text()}`);
  }
  return res.json();
}

export async function updateWeight(
  request: APIRequestContext,
  token: string,
  houseId: string,
  userId: string,
  weight_percentage: number
) {
  const res = await request.put(`/api/houses/${houseId}/members/${userId}/weight`, {
    headers: authHeaders(token),
    data: { weight_percentage },
  });
  if (!res.ok()) {
    throw new Error(`Falha ao definir peso: ${res.status()} ${await res.text()}`);
  }
  return res.json();
}
