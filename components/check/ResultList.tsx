"use client";

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
                  <Badge variant="destructive">Duped</Badge>
                  <span className="text-sm text-muted-foreground">
                    DefIndex: {item.defindex}
                  </span>
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
