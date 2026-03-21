import type { SqlExerciseResponse, SqlRunResponse, SqlSubmitResponse } from '@/types/practice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function fetchSqlExercise(exerciseId: string) {
  return request<SqlExerciseResponse>(`/api/exercises/${exerciseId}`);
}

export function saveSqlDraft(exerciseId: string, sql: string) {
  return request<{ draftAttempt: { sql: string; updatedAt: string }; saveState: string }>(
    `/api/attempts/${exerciseId}/draft`,
    {
      method: 'PUT',
      body: JSON.stringify({ sql }),
    },
  );
}

export function runSqlQuery(exerciseId: string, sql: string) {
  return request<SqlRunResponse>(`/api/attempts/${exerciseId}/run`, {
    method: 'POST',
    body: JSON.stringify({ sql }),
  });
}

export function submitSqlQuery(exerciseId: string, sql: string) {
  return request<SqlSubmitResponse>(`/api/attempts/${exerciseId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ sql }),
  });
}
