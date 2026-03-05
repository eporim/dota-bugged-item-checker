import Image from "next/image";
import { CheckForm } from "@/components/check/CheckForm";

const DOTA_IMAGE =
  "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota2_social.jpg";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-2xl flex-col items-center gap-8">
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src={DOTA_IMAGE}
            alt="Dota 2"
            width={600}
            height={315}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bugged Item Checker
          </h1>
          <p className="mt-2 text-muted-foreground">
            Check Dota 2 Steam inventories for duped items before buying or
            trading
          </p>
        </div>

        <CheckForm />
      </section>
    </div>
  );
}
