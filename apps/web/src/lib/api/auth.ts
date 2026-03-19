import { apiRequest } from "@/lib/api/http";
import type { CurrentUser } from "@/lib/types";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  access_session_id: string;
  user_id: string;
  email: string;
  display_name: string;
  roles: string[];
  expires_at: string;
}

interface CurrentUserResponse {
  user_id: string;
  email: string;
  display_name: string;
  roles: string[];
  access_session_id?: string | null;
  expires_at?: string | null;
}

export async function login(input: LoginInput): Promise<CurrentUser> {
  const result = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return {
    userId: result.user_id,
    email: result.email,
    displayName: result.display_name,
    roles: result.roles,
    accessSessionId: result.access_session_id,
    authFresh: true,
    expiresAt: result.expires_at,
  };
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const me = await apiRequest<CurrentUserResponse>("/auth/me");
  return {
    userId: me.user_id,
    email: me.email,
    displayName: me.display_name,
    roles: me.roles,
    accessSessionId: me.access_session_id ?? null,
    expiresAt: me.expires_at ?? null,
  };
}

export async function logout(): Promise<void> {
  await apiRequest<void>("/auth/logout", {
    method: "POST",
  });
}
