/** Turn a login 账号 into the email Better Auth stores. */
export function accountToEmail(account: string): string {
  const a = account.trim();
  if (!a) return "";
  if (a.includes("@")) return a;
  const local = a.replace(/\s+/g, ".").replace(/[^\w.-]/g, "");
  if (!local) return "";
  return `${local.toLowerCase()}@naranjo.local`;
}

export function isLikelyEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value.trim());
}
