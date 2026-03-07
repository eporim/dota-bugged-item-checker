import NextAuth from "next-auth";
import SteamProvider from "authjs-steam-provider";

if (!process.env.AUTH_SECRET) {
  throw new Error(
    "AUTH_SECRET is required. Add it to .env (e.g. AUTH_SECRET=$(openssl rand -base64 32))"
  );
}

const baseUrl =
  process.env.AUTH_URL ??
  process.env.NEXTAUTH_URL ??
  `http://localhost:${process.env.PORT ?? 3000}`;

export const { handlers, auth, signIn, signOut } = NextAuth((req) => ({
  providers: [
    SteamProvider(req!, {
      clientSecret: process.env.STEAM_API_KEY!,
      callbackUrl: `${baseUrl}/api/auth/callback`,
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
}));
