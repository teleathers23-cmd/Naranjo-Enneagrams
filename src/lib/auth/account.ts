/** Turn a login 账号 into the email Better Auth stores. */
export function accountToEmail(account: string): string {
  const a = account.trim();
  if (!a) return "";
  if (a.includes("@")) return a;
  const local = a.replace(/\s+/g, ".").replace(/[^\w.-]/g, "");
  if (!local) return "";
  return `${local.toLowerCase()}@naranjo.local`;
}

export function authErrorMessage(raw: string | undefined | null): string {
  const m = (raw ?? "").toLowerCase();
  if (!raw) return "登录失败，请再试。";
  if (m.includes("invalid origin")) return "当前网址未被允许登录，请用正式域名打开。";
  if (m.includes("already exists")) return "这个账号已经注册过，请直接登录。";
  if (m.includes("invalid email")) return "账号格式不对。请用邮箱，或英文字母数字用户名。";
  if (m.includes("invalid password") || m.includes("invalid credentials"))
    return "账号或密码不对。";
  if (m.includes("too many") || m.includes("rate")) return "尝试过多，请稍后再试。";
  return raw;
}
