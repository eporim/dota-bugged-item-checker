"use client";

import { useState } from "react";
import { PiSignIn } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/layout/AuthProvider";

export function SignInButton() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [open, setOpen] = useState(false);

  if (!auth || auth.isLoading) return null;
  if (auth.user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("loading");
    const { error } = await auth.signInWithEmail(trimmed);
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setEmail("");
      setStatus("idle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Sign in">
          <PiSignIn className="size-4" aria-hidden />
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Enter your email to receive a magic link. Sign in to save favorites.
          </DialogDescription>
        </DialogHeader>
        {status === "sent" ? (
          <p className="text-sm text-muted-foreground">
            Check your email for the sign-in link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              aria-label="Email address"
            />
            {status === "error" && (
              <p className="text-sm text-destructive">Something went wrong. Try again.</p>
            )}
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Send magic link"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
