import { Skeleton } from '@/components/ui/skeleton';
import { GuestbookListSkeleton } from '@/components/guestbook/guestbook-skeletons';
import { GUESTBOOK_GRID } from '@/components/guestbook/layout-classes';

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading guestbook" className={GUESTBOOK_GRID}>
      <div className="lg:sticky lg:top-24">
        <div
          className="hud-panel min-h-[402px] space-y-4 p-4 sm:min-h-[414px] sm:p-5 md:min-h-[368px] lg:min-h-[392px]"
          aria-hidden
        >
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <GuestbookListSkeleton />
    </div>
  );
}
