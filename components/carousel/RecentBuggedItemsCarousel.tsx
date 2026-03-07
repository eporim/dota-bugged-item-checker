"use client";

import { useState } from "react";
import Image from "next/image";
import { useRecentBuggedItems, type RecentBuggedItem } from "@/data-hooks/useRecentBuggedItems";
import { BuggedItemDetail } from "@/components/carousel/BuggedItemDetail";
import { Skeleton } from "@/components/ui/skeleton";

function CarouselItem({
  item,
  onClick,
}: {
  item: RecentBuggedItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex shrink-0 flex-col items-center gap-1 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      aria-label={`View bugged item ${item.item_name ?? item.defindex} from profile`}
    >
      <div className="relative size-16 overflow-hidden rounded-lg border border-border bg-muted sm:size-20">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.item_name ?? `Item ${item.defindex}`}
            fill
            className="object-contain"
            sizes="80px"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
            {item.defindex}
          </span>
        )}
      </div>
      {item.item_name && (
        <span className="max-w-[5rem] truncate text-xs text-muted-foreground sm:max-w-[6rem]">
          {item.item_name}
        </span>
      )}
    </button>
  );
}

export function RecentBuggedItemsCarousel() {
  const { data: items, isLoading, isError } = useRecentBuggedItems();
  const [selectedSteamId, setSelectedSteamId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleItemClick = (steamid64: string) => {
    setSelectedSteamId(steamid64);
    setDetailOpen(true);
  };

  if (isLoading) {
    return (
      <section className="border-t border-border bg-card/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-lg font-semibold">Recently found bugged items</h2>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="size-20 shrink-0 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !items || items.length === 0) {
    return null;
  }

  return (
    <>
      <section className="border-t border-border bg-card/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-lg font-semibold">Recently found bugged items</h2>
          <div
            className="relative flex gap-6 overflow-x-auto pb-2 scrollbar-thin"
            style={{
              maskImage:
                "linear-gradient(to right, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, black 70%, transparent 100%)",
            }}
          >
            {items.map((item) => (
              <CarouselItem
                key={`${item.steamid64}-${item.asset_id}`}
                item={item}
                onClick={() => handleItemClick(item.steamid64)}
              />
            ))}
          </div>
        </div>
      </section>
      <BuggedItemDetail
        steamid64={selectedSteamId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
