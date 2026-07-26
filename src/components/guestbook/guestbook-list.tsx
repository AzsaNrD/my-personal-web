import Image from 'next/image';
import { UserRound } from 'lucide-react';
import { GithubIcon, DiscordIcon, GoogleIcon } from '@/components/ui/brand-icons';
import { getGuestbookEntries } from '@/lib/db/guestbook';
import { siteConfig } from '@/lib/site-config';
import { auth } from '@/lib/auth';
import { formatRelative } from '@/lib/utils';
import { DeleteButton } from './delete-button';

const OWNER_IDS = new Set(siteConfig.ownerIds);

export async function GuestbookList() {
  const session = await auth();
  const currentUserKey =
    session?.user?.provider && session?.user?.providerAccountId
      ? `${session.user.provider}:${session.user.providerAccountId}`
      : null;
  const isOwnerSession = currentUserKey ? OWNER_IDS.has(currentUserKey) : false;

  let entries: Awaited<ReturnType<typeof getGuestbookEntries>>;
  try {
    entries = await getGuestbookEntries();
  } catch (error) {
    console.error('[guestbook-list]', error);
    return (
      <p className="text-muted-foreground border-border rounded-xl border border-dashed p-8 text-center text-sm">
        Database is not ready or connection failed.
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground border-border rounded-xl border border-dashed p-8 text-center text-sm">
        No messages yet. Be the first!
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => {
        const isOwner = !entry.anonymous && OWNER_IDS.has(entry.userId);
        const isAuthor = currentUserKey !== null && entry.userId === currentUserKey;
        const canDelete = isOwnerSession || isAuthor;
        const displayName = entry.anonymous ? 'Anonymous' : entry.name;
        const showAvatar = !entry.anonymous && entry.avatar;
        return (
          <li
            key={entry.id}
            className={
              isOwner
                ? 'border-primary/40 from-primary/5 relative flex items-start gap-3 overflow-hidden rounded-lg border bg-gradient-to-br to-transparent p-4'
                : 'border-border bg-card flex items-start gap-3 rounded-xl border p-4'
            }
          >
            {isOwner && (
              <span aria-hidden className="bg-primary absolute top-0 left-0 h-full w-0.5" />
            )}
            {showAvatar ? (
              <Image
                src={entry.avatar!}
                alt={displayName}
                width={36}
                height={36}
                className={
                  isOwner
                    ? 'ring-primary/60 ring-offset-card size-9 shrink-0 rounded-full object-cover ring-2 ring-offset-2'
                    : 'size-9 shrink-0 rounded-full object-cover'
                }
                referrerPolicy="no-referrer"
                unoptimized
              />
            ) : (
              <span className="bg-muted text-muted-foreground inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                <UserRound size={16} aria-hidden />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p className="text-foreground truncate text-sm font-medium">{displayName}</p>
                {isOwner && (
                  <span className="bg-primary/15 text-primary inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                    author
                  </span>
                )}
                <span className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                  {!entry.anonymous && entry.provider === 'github' ? (
                    <GithubIcon size={11} />
                  ) : !entry.anonymous && entry.provider === 'discord' ? (
                    <DiscordIcon size={11} />
                  ) : !entry.anonymous && entry.provider === 'google' ? (
                    <GoogleIcon size={11} />
                  ) : null}
                  <span>·</span>
                  <time dateTime={entry.createdAt.toISOString()}>
                    {formatRelative(entry.createdAt)}
                  </time>
                </span>
              </div>
              <p className="text-foreground mt-1 text-sm break-words whitespace-pre-wrap">
                {entry.message}
              </p>
            </div>
            {canDelete && (
              <div className="shrink-0">
                <DeleteButton id={entry.id} preview={entry.message} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
