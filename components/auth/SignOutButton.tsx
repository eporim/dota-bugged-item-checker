"use client";

import { PiSignOut } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/layout/AuthProvider";

export function SignOutButton() {
  const auth = useAuth();

  if (!auth || auth.isLoading || !auth.user) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => auth.signOut()}
      aria-label="Sign out"
    >
      <PiSignOut className="size-4" aria-hidden />
      Sign out
    </Button>
  );
}
