import { Skeleton } from '@/components/ui/skeleton';
import { GuestbookListSkeleton } from '@/components/guestbook/guestbook-skeletons';

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading guestbook">
      <div
        className="hud-panel min-h-[367px] space-y-4 p-4 sm:min-h-[347px] sm:p-5 md:min-h-[303px]"
        aria-hidden
      >
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="mt-10">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">
          Messages from visitors
        </h2>
        <div className="mt-4">
          <GuestbookListSkeleton />
        </div>
      </div>
    </div>
  );
}
