"use client";

import Link from "next/link";
import { PiMagnifyingGlass } from "react-icons/pi";
import { SignInButton } from "@/components/auth/SignInButton";
import { SignOutButton } from "@/components/auth/SignOutButton";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 transition-opacity hover:opacity-90 sm:gap-2"
          aria-label="Bugged Item Checker home"
        >
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary sm:size-8">
            <PiMagnifyingGlass
              className="size-4 text-primary-foreground sm:size-5"
              aria-hidden
            />
          </div>
          <span className="text-lg font-bold text-foreground">
            Bugged Item <span className="text-primary">Checker</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <SignInButton />
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}
