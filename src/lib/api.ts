export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
  const raw = await response.text();
  let payload: any = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = { message: raw };
  }
  if (!response.ok) {
    const message = Array.isArray(payload.message)
      ? payload.message.join(", ")
      : payload.message || `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }
  return payload as T;
}

export function unwrap<T>(value: any): T {
  if (value && typeof value === "object" && "data" in value)
    return value.data as T;
  if (value && typeof value === "object" && "user" in value)
    return value.user as T;
  return value as T;
}

export type User = {
  id: number;
  name: string;
  email: string;
  role: "coach" | "student";
  createdAt?: string;
};
export type Tournament = {
  id: number;
  name: string;
  timeControl: string;
  startAt: string;
  status: "draft" | "open" | "ongoing" | "completed";
  createdAt?: string;
};
export type Match = {
  id: number;
  tournamentId: number;
  whitePlayerId: number;
  blackPlayerId: number;
  status: "ongoing" | "completed";
  result: "white_win" | "black_win" | "draw" | null;
  fen: string;
  pgn: string | null;
  createdAt: string;
  endedAt?: string | null;
};
