import type { UserRole } from "@/types/api";

export const API_BASE =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8080/api";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";
const USER_KEY = "auth_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getRole(): UserRole | null {
  const role = localStorage.getItem(ROLE_KEY);
  if (role === 'aluno' || role === 'professor' || role === 'empresa') {
    return role;
  }
  return null;
}

export function setRole(role: UserRole | null) {
  if (role) localStorage.setItem(ROLE_KEY, role);
  else localStorage.removeItem(ROLE_KEY);
}

export function getStoredUser<T>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setStoredUser(user: unknown) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
  // Limpar também chaves antigas para compatibilidade
  localStorage.removeItem("aluno_token");
  localStorage.removeItem("aluno_data");
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: unknown,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  const text = await response.text();
  let body: unknown = text;
  try { body = text ? JSON.parse(text) : null; } catch { /* keep as text */ }

  if (!response.ok) {
    const msg = typeof body === "string" ? body : `HTTP ${response.status}`;
    throw new ApiError(response.status, body, msg);
  }
  return body as T;
}

export const api = {
  get:  <T,>(endpoint: string)            => request<T>("GET",  endpoint),
  post: <T,>(endpoint: string, data?: any) => request<T>("POST", endpoint, data),
  put:  <T,>(endpoint: string, data?: any) => request<T>("PUT",  endpoint, data),
  del:  <T,>(endpoint: string)            => request<T>("DELETE", endpoint),
};
