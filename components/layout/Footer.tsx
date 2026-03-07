import { PiMagnifyingGlass } from "react-icons/pi";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
        <div>
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary sm:size-8">
                <PiMagnifyingGlass className="size-4 text-primary-foreground sm:size-5" aria-hidden />
              </div>
              <span className="text-lg font-bold text-foreground">
                Bugged Item <span className="text-primary">Checker</span>
              </span>
            </div>
          </div>
          <p className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
            This product is not affiliated with, endorsed by, or connected to
            Valve Corporation or Steam in any way.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed sm:text-sm">
            Dota 2 and Steam are trademarks of Valve Corporation. All copyright
            and trademark material belongs to their respective owners.
          </p>
        </div>
        <div className="mt-6 border-t border-border pt-4 sm:mt-8 sm:pt-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row">
            <p className="text-center text-xs text-muted-foreground md:text-left">
              Game content, copy and materials are trademarks of their respective
              publisher and its licensors. All rights belong to their respective
              owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
