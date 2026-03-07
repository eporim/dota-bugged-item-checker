"use client";

import {
  createContext,
  useContext,
  useCallback,
} from "react";
import type { Session } from "next-auth";
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

interface AuthContextValue {
  user: Session["user"] | null;
  session: Session | null;
  isLoading: boolean;
  signInWithSteam: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const user = session?.user ?? null;

  const signInWithSteam = useCallback(async () => {
    await nextAuthSignIn("steam");
  }, []);

  const signOut = useCallback(async () => {
    await nextAuthSignOut();
  }, []);

  const value: AuthContextValue = {
    user,
    session: session ?? null,
    isLoading,
    signInWithSteam,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue | null {
  return useContext(AuthContext);
}
