import type { UserRole } from "@/types/api";

export const API_BASE =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8081/api";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";
const USER_KEY = "auth_user";

const REQUEST_TIMEOUT_MS = 20000;

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

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

function extractErrorMessage(body: unknown, status: number): string {
  if (typeof body === "string" && body.length > 0) return body;
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (typeof obj.error === "string") return obj.error;
    if (typeof obj.message === "string") return obj.message;
  }
  return `HTTP ${status}`;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: unknown,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });
  } catch (e: any) {
    clearTimeout(timeoutId);
    if (e?.name === "AbortError") {
      throw new ApiError(0, null, "Tempo limite excedido. Verifique sua conexão.");
    }
    throw new ApiError(0, null, "Falha de conexão com o servidor.");
  }
  clearTimeout(timeoutId);

  const text = await response.text();
  let body: unknown = text;
  try { body = text ? JSON.parse(text) : null; } catch { /* keep as text */ }

  if (!response.ok) {
    throw new ApiError(response.status, body, extractErrorMessage(body, response.status));
  }
  return { data: body as T, status: response.status, ok: response.ok };
}

export const api = {
  get:    <T,>(endpoint: string)             => request<T>("GET",    endpoint),
  post:   <T,>(endpoint: string, data?: any) => request<T>("POST",   endpoint, data),
  put:    <T,>(endpoint: string, data?: any) => request<T>("PUT",    endpoint, data),
  del:    <T,>(endpoint: string)             => request<T>("DELETE", endpoint),
  delete: <T,>(endpoint: string)             => request<T>("DELETE", endpoint),
};
