import NextAuth from "next-auth";
import SteamProvider from "authjs-steam-provider";

const baseUrl =
  process.env.AUTH_URL ??
  process.env.NEXTAUTH_URL ??
  `http://localhost:${process.env.PORT ?? 3000}`;

export const { handlers, auth, signIn, signOut } = NextAuth((req) => ({
  providers: [
    SteamProvider(req!, {
      clientSecret: process.env.STEAM_API_KEY!,
      callbackUrl: `${baseUrl}/api/steam-callback`,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  trustHost: true,
  pages: {
    error: "/auth-error",
  },
}));
