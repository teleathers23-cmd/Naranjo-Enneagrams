import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { EnneagramGlyph } from "./enneagram-glyph";

export function SiteHeader() {
  const { isPending } = useCurrentUserState();

  return (
    <header className="border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-fg">
          <EnneagramGlyph className="size-7" />
          <span className="font-display text-[0.95rem] font-medium tracking-wide">
            二十七副型
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted sm:gap-3">
          <Link
            to="/test"
            className="rounded-md px-2 py-1.5 hover:bg-surface-2 hover:text-fg"
          >
            测验
          </Link>
          <Link
            to="/types"
            className="rounded-md px-2 py-1.5 hover:bg-surface-2 hover:text-fg"
          >
            原典
          </Link>
          <Link
            to="/about"
            className="rounded-md px-2 py-1.5 hover:bg-surface-2 hover:text-fg"
          >
            说明
          </Link>
          {isPending ? (
            <span className="ml-1 inline-block h-8 w-16 animate-pulse rounded-md bg-surface-2" />
          ) : (
            <>
              <SignedIn>
                <Link
                  to="/history"
                  className="hidden rounded-md px-2 py-1.5 hover:bg-surface-2 hover:text-fg sm:inline"
                >
                  记录
                </Link>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Link
                  to="/login"
                  className="rounded-md px-2 py-1.5 hover:bg-surface-2 hover:text-fg"
                >
                  登录
                </Link>
              </SignedOut>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
