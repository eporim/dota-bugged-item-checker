"use client";

import { FaSteam } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/layout/AuthProvider";

export function SignInButton() {
  const auth = useAuth();

  if (!auth || auth.isLoading) return null;
  if (auth.user) return null;

  return (
    <Button
      className="gap-2 bg-[#1b2838] text-white hover:bg-[#2a475e] dark:bg-[#1b2838] dark:hover:bg-[#2a475e]"
      size="sm"
      onClick={() => auth.signInWithSteam()}
      aria-label="Log in with Steam"
    >
      <FaSteam className="size-4" aria-hidden />
      Log in with Steam
    </Button>
  );
}
