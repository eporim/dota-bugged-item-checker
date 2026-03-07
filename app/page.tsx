import Image from "next/image";
import { CheckForm } from "@/components/check/CheckForm";
import { RecentBuggedItemsCarousel } from "@/components/carousel/RecentBuggedItemsCarousel";

const DOTA_IMAGE =
  "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota2_social.jpg";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <section className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16">
          <div className="relative order-2 overflow-hidden rounded-xl lg:order-1 lg:min-h-[280px]">
            <Image
              src={DOTA_IMAGE}
              alt="Dota 2"
              width={600}
              height={315}
              className="h-full w-full object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
          </div>
          <div className="order-1 flex flex-col gap-8 lg:order-2 lg:justify-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Bugged Item Checker
              </h1>
              <p className="mt-2 text-muted-foreground">
                Check Dota 2 Steam inventories for duped items before buying or
                trading
              </p>
            </div>
            <CheckForm />
          </div>
        </section>
      </div>
      <RecentBuggedItemsCarousel />
    </div>
  );
}
