import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import {
  deleteCookie,
  getCookie,
  getRequest,
  getRequestHeader,
  getRequestIP,
  getRequestProtocol,
  setCookie,
} from "@tanstack/react-start/server";

const ADMIN_USER = "teleathers23";
const ADMIN_PASS = "teleathers23";
const COOKIE = "naranjo_admin";
const TTL_SEC = 60 * 60 * 24 * 7;

const g = globalThis as typeof globalThis & {
  __naranjoAdminSecret__?: string;
  __naranjoAdminAttempts__?: Map<string, { n: number; reset: number }>;
};

function secret(): string {
  const env = process.env.BETTER_AUTH_SECRET?.trim();
  if (env) return env;
  g.__naranjoAdminSecret__ ??= randomBytes(32).toString("hex");
  return g.__naranjoAdminSecret__;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function clientIp(): string {
  try {
    const ip = getRequestIP({ xForwardedFor: true });
    if (ip) return ip;
  } catch {
    /* ignore */
  }
  const headers = getRequest()?.headers;
  const raw =
    headers?.get("cf-connecting-ip") ||
    headers?.get("x-real-ip") ||
    headers?.get("x-forwarded-for") ||
    "";
  return raw.split(",")[0]?.trim() || "unknown";
}

export function clientUa(): string {
  return (getRequestHeader("user-agent") ?? "").slice(0, 400);
}

function tooManyAttempts(ip: string): boolean {
  g.__naranjoAdminAttempts__ ??= new Map();
  const now = Date.now();
  const row = g.__naranjoAdminAttempts__.get(ip);
  if (!row || row.reset < now) {
    g.__naranjoAdminAttempts__.set(ip, { n: 1, reset: now + 15 * 60 * 1000 });
    return false;
  }
  row.n += 1;
  return row.n > 12;
}

export function loginAdmin(
  username: string,
  password: string,
): { ok: true } | { ok: false; error: string } {
  const ip = clientIp();
  if (tooManyAttempts(ip)) {
    return { ok: false, error: "尝试过多，请稍后再试。" };
  }
  const userOk = safeEqual(username.trim(), ADMIN_USER);
  const passOk = safeEqual(password, ADMIN_PASS);
  if (!userOk || !passOk) {
    return { ok: false, error: "账号或密码不对。" };
  }
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const payload = `v1|${ADMIN_USER}|${exp}`;
  const value = `${payload}|${sign(payload)}`;
  setCookie(COOKIE, value, {
    httpOnly: true,
    path: "/",
    maxAge: TTL_SEC,
    sameSite: "lax",
    secure: getRequestProtocol({ xForwardedProto: true }) === "https",
  });
  return { ok: true };
}

export function logoutAdmin(): void {
  deleteCookie(COOKIE, { path: "/" });
}

export function isAdmin(): boolean {
  const raw = getCookie(COOKIE);
  if (!raw) return false;
  const parts = raw.split("|");
  if (parts.length !== 4) return false;
  const [v, user, expStr, mac] = parts;
  const payload = `${v}|${user}|${expStr}`;
  if (!safeEqual(sign(payload), mac ?? "")) return false;
  if (user !== ADMIN_USER) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  return true;
}

export function requireAdmin(): void {
  if (!isAdmin()) {
    const err = new Error("Unauthorized");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }
}
