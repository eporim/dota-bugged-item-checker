"use client";

import { useCheckResult } from "@/data-hooks/useCheckResult";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PiArrowSquareOut } from "react-icons/pi";
import Image from "next/image";

interface BuggedItemDetailProps {
  steamid64: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BuggedItemDetail({
  steamid64,
  open,
  onOpenChange,
}: BuggedItemDetailProps) {
  const { data, isLoading, isError } = useCheckResult(steamid64);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bugged items found</DialogTitle>
        </DialogHeader>
        {!steamid64 ? (
          <p className="text-sm text-muted-foreground">No profile selected.</p>
        ) : isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-muted-foreground">
            Could not load results. The cache may have expired.
          </p>
        ) : (
          <div className="space-y-4">
            <a
              href={`https://steamcommunity.com/profiles/${data.steamid64}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              View Steam profile
              <PiArrowSquareOut className="size-4" aria-hidden />
            </a>
            <p className="text-sm text-muted-foreground">
              Checked {data.totalChecked} item{data.totalChecked !== 1 ? "s" : ""}
            </p>
            <ul className="space-y-3" role="list">
              {data.dupedItems.map((item) => (
                <li
                  key={item.assetId}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.itemName ?? `Item ${item.defindex}`}
                        width={64}
                        height={64}
                        className="size-12 shrink-0 rounded object-contain bg-muted"
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="destructive">Duped</Badge>
                        <span className="text-sm font-medium">
                          {item.itemName ?? `DefIndex: ${item.defindex}`}
                        </span>
                      </div>
                      {item.gems && item.gems.length > 0 && (
                        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                          {item.gems.map((g, i) => (
                            <span key={i}>
                              {g.type}: {g.value ?? "—"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <a
                    href={item.inventoryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    View in inventory
                    <PiArrowSquareOut className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
