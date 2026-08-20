import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { authEnabled, signOut } from "./client";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";

export const SIGN_IN_PATH = "/login";

function isRealUser(user: { isDevFallback?: boolean } | null): boolean {
  return Boolean(user) && !user?.isDevFallback;
}

export function SignedIn({ children }: { children: ReactNode }) {
  const { user } = useCurrentUserState();
  return isRealUser(user) ? <>{children}</> : null;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || isRealUser(user)) return null;
  return <>{children}</>;
}

export function RedirectToSignIn({ to = SIGN_IN_PATH }: { to?: string }) {
  return <Navigate to={to} />;
}

export function UserButton() {
  const user = useCurrentUser();
  if (!user || user.isDevFallback) return null;
  const label = user.displayName ?? user.primaryEmail ?? "账户";
  return (
    <div className="flex items-center gap-2">
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt=""
          className="size-7 rounded-full object-cover"
        />
      ) : (
        <span className="grid size-7 place-items-center rounded-full bg-surface-2 text-xs font-medium">
          {label.charAt(0).toUpperCase()}
        </span>
      )}
      {authEnabled && (
        <button
          type="button"
          className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
          onClick={() => void signOut()}
        >
          退出
        </button>
      )}
    </div>
  );
}
