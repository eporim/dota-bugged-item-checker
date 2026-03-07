"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PiArrowSquareOut } from "react-icons/pi";
import type { DupedItem } from "@/types/dupe";

interface ResultListProps {
  dupedItems: DupedItem[];
  totalChecked: number;
  cached: boolean;
  isLoading?: boolean;
}

export function ResultList({
  dupedItems,
  totalChecked,
  cached,
  isLoading = false,
}: ResultListProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  const hasDupes = dupedItems.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {hasDupes
            ? `${dupedItems.length} duped item${dupedItems.length === 1 ? "" : "s"} found`
            : "No duped items were found"}
        </CardTitle>
        <CardDescription>
          Checked {totalChecked} item{totalChecked === 1 ? "" : "s"}
          {cached && " (from cache)"}
        </CardDescription>
      </CardHeader>
      {hasDupes && (
        <CardContent>
          <ul className="space-y-3" role="list">
            {dupedItems.map((item) => (
              <li
                key={item.assetId}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.itemName ?? `Item ${item.defindex}`}
                      width={48}
                      height={48}
                      className="size-12 shrink-0 rounded object-contain bg-muted"
                    />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="destructive">Duped</Badge>
                      <span className="text-sm font-medium">
                        {item.itemName ?? `DefIndex: ${item.defindex}`}
                      </span>
                    </div>
                    {item.gems && item.gems.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {item.gems.map((g) => `${g.type}: ${g.value ?? "—"}`).join(", ")}
                      </span>
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
        </CardContent>
      )}
    </Card>
  );
}
