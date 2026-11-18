import { Skeleton } from '@/components/ui/skeleton';
import { MessagesHeading } from '@/components/guestbook/messages-heading';

export function GuestbookListSkeleton() {
  return (
    <div className="space-y-5">
      <MessagesHeading />
      <ul className="space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <li key={idx} className="border-border flex items-start gap-3 rounded-xl border p-4">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
