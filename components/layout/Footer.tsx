import Link from "next/link";
import { PiGithubLogo } from "react-icons/pi";

const GITHUB_URL =
  process.env.NEXT_PUBLIC_REPO_URL ?? "https://github.com";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-muted/30 px-4 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div className="space-y-2 text-left text-xs text-muted-foreground">
          <p>
            This is a personal project and is not affiliated with, endorsed by,
            or connected to Valve Corporation or Steam in any way.
          </p>
          <p>
            Dota 2 and Steam are trademarks of Valve Corporation. All copyright
            and trademark material belongs to their respective owners.
          </p>
        </div>
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          aria-label="View source on GitHub"
        >
          <PiGithubLogo className="size-4" />
        </Link>
      </div>
    </footer>
  );
}
