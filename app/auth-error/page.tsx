import Link from "next/link";
import { PiArrowLeft } from "react-icons/pi";
import { Button } from "@/components/ui/button";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error === "Configuration"
            ? "There was a problem with the server configuration. Please try again later."
            : error === "AccessDenied"
              ? "Access was denied."
              : error === "Verification"
                ? "The verification link has expired or was already used."
                : "An error occurred during sign in. Please try again."}
        </p>
        <Button asChild className="mt-6 gap-2" size="lg">
          <Link href="/">
            <PiArrowLeft className="size-4" aria-hidden />
            Go back home
          </Link>
        </Button>
      </div>
    </div>
  );
}
