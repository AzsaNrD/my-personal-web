import { UserRound } from 'lucide-react';
import { GithubIcon, DiscordIcon, GoogleIcon } from '@/components/ui/brand-icons';
import { getDeletedEntries, getGuestbookEntries, getPendingEntries } from '@/lib/db/guestbook';
import type { Guestbook } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { getGuestKey } from '@/lib/guestbook-guest';
import { isOwnerKey, userKey } from '@/lib/is-owner';
import { formatRelative } from '@/lib/utils';
import { LoadingImage } from '@/components/ui/loading-image';
import { ApproveButton } from './approve-button';
import { DeleteButton } from './delete-button';

function EntryItem({
  entry,
  isOwnerSession,
  currentKey,
}: {
  entry: Guestbook;
  isOwnerSession: boolean;
  currentKey: string | null;
}) {
  const isPending = entry.status === 'pending';
  const isOwner = !entry.anonymous && isOwnerKey(entry.userId);
  const isAuthor = currentKey !== null && entry.userId === currentKey;
  const canDelete = isOwnerSession || isAuthor;
  const displayName = entry.anonymous ? 'Anonymous' : entry.name;
  const showAvatar = !entry.anonymous && entry.avatar;
  return (
    <li
      className={
        isPending
          ? 'border-border bg-card/60 flex items-start gap-3 rounded-xl border border-dashed p-4'
          : isOwner
            ? 'border-primary/40 from-primary/5 relative flex items-start gap-3 overflow-hidden rounded-lg border bg-gradient-to-br to-transparent p-4'
            : 'border-border bg-card flex items-start gap-3 rounded-xl border p-4'
      }
    >
      {isOwner && !isPending && (
        <span aria-hidden className="bg-primary absolute top-0 left-0 h-full w-0.5" />
      )}
      {showAvatar ? (
        <LoadingImage
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
            ) : entry.provider === 'guest' ? (
              <span>guest</span>
            ) : null}
            <span>·</span>
            <time dateTime={entry.createdAt.toISOString()}>{formatRelative(entry.createdAt)}</time>
          </span>
        </div>
        <p className="text-foreground mt-1 text-sm break-words whitespace-pre-wrap">
          {entry.message}
        </p>
      </div>
      <div className="flex shrink-0 items-start gap-1">
        {isPending && isOwnerSession && <ApproveButton id={entry.id} />}
        {canDelete && <DeleteButton id={entry.id} preview={entry.message} />}
      </div>
    </li>
  );
}

export async function GuestbookList() {
  const session = await auth();
  const signedInKey = userKey(session?.user?.provider, session?.user?.providerAccountId);
  const isOwnerSession = isOwnerKey(signedInKey);
  const currentKey = signedInKey ?? (await getGuestKey());

  let entries: Guestbook[];
  let pending: Guestbook[];
  let deleted: Guestbook[];
  try {
    [entries, pending, deleted] = await Promise.all([
      getGuestbookEntries(),
      isOwnerSession
        ? getPendingEntries()
        : currentKey?.startsWith('guest:')
          ? getPendingEntries(currentKey)
          : Promise.resolve([]),
      isOwnerSession ? getDeletedEntries() : Promise.resolve([]),
    ]);
  } catch (error) {
    console.error('[guestbook-list]', error);
    return (
      <p className="text-muted-foreground border-border rounded-xl border border-dashed p-8 text-center text-sm">
        Database is not ready or connection failed.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section aria-label="Messages waiting for approval">
          <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
            {isOwnerSession
              ? `Needs your review (${pending.length})`
              : 'Waiting for approval, only you can see these'}
          </p>
          <ul className="mt-3 space-y-3">
            {pending.map((entry) => (
              <EntryItem
                key={entry.id}
                entry={entry}
                isOwnerSession={isOwnerSession}
                currentKey={currentKey}
              />
            ))}
          </ul>
        </section>
      )}

      {entries.length === 0 ? (
        <p className="text-muted-foreground border-border rounded-xl border border-dashed p-8 text-center text-sm">
          No messages yet. Be the first!
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              isOwnerSession={isOwnerSession}
              currentKey={currentKey}
            />
          ))}
        </ul>
      )}

      {deleted.length > 0 && (
        <details className="border-border rounded-xl border border-dashed p-4">
          <summary className="text-muted-foreground cursor-pointer font-mono text-[10px] tracking-wider uppercase">
            Deleted messages, only you can see these ({deleted.length})
          </summary>
          <ul className="mt-3 space-y-3">
            {deleted.map((entry) => (
              <li key={entry.id} className="text-sm">
                <p className="text-muted-foreground text-[11px]">
                  <span className="text-foreground font-medium">
                    {entry.anonymous ? 'Anonymous' : entry.name}
                  </span>
                  {` · ${entry.provider} · was ${entry.status} · posted `}
                  <time dateTime={entry.createdAt.toISOString()}>
                    {formatRelative(entry.createdAt)}
                  </time>
                  {' · deleted '}
                  <time dateTime={entry.deletedAt!.toISOString()}>
                    {formatRelative(entry.deletedAt!)}
                  </time>
                </p>
                <p className="text-muted-foreground mt-1 break-words whitespace-pre-wrap">
                  {entry.message}
                </p>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
