export const API_BASE =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8080/api";

const TOKEN_KEY = "aluno_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
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
