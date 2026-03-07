import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const baseUrl =
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`;

  const searchParams = new URLSearchParams(req.nextUrl.searchParams);
  searchParams.set("code", "steam-openid");
  const redirectUrl = new URL(
    `/api/auth/callback/${provider}`,
    baseUrl
  );
  redirectUrl.search = searchParams.toString();
  return Response.redirect(redirectUrl.toString());
}
