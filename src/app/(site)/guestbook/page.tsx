import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { SignInButtons, SignOutButton } from '@/components/guestbook/auth-buttons';
import { GuestbookForm } from '@/components/guestbook/guestbook-form';
import { GuestbookList } from '@/components/guestbook/guestbook-list';
import { GithubIcon, DiscordIcon, GoogleIcon } from '@/components/ui/brand-icons';
import { GuestbookListSkeleton } from '@/components/guestbook/guestbook-skeletons';
import { GUESTBOOK_GRID } from '@/components/guestbook/layout-classes';

export const metadata: Metadata = {
  title: 'Guestbook',
  description:
    'A little corner for visitors to leave a message, share feedback, or just say hi. No account needed.',
};

export default async function GuestbookPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className={GUESTBOOK_GRID}>
      <div className="lg:sticky lg:top-24">
        <div className="hud-panel hud-corners p-4 sm:p-5">
          <p className="text-muted-foreground mb-4 flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase">
            <span className="text-primary/60" aria-hidden>
              //
            </span>
            New message
          </p>
          {user ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {user.image && (
                    <Image
                      src={user.image}
                      alt={user.name ?? 'avatar'}
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      unoptimized
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-medium">
                      {user.name ?? 'unknown'}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      {user.provider === 'github' ? (
                        <GithubIcon size={12} />
                      ) : user.provider === 'discord' ? (
                        <DiscordIcon size={12} />
                      ) : user.provider === 'google' ? (
                        <GoogleIcon size={12} />
                      ) : null}
                      <span className="capitalize">{user.provider ?? 'logged in'}</span>
                    </p>
                  </div>
                </div>
                <SignOutButton />
              </div>

              <GuestbookForm guest={false} />
            </div>
          ) : (
            <div className="space-y-5">
              <GuestbookForm guest />
              <div className="border-border space-y-3 border-t pt-4">
                <p className="text-muted-foreground text-sm">Or sign in to post with your name.</p>
                <SignInButtons />
              </div>
            </div>
          )}
        </div>
      </div>

      <Suspense fallback={<GuestbookListSkeleton />}>
        <GuestbookList />
      </Suspense>
    </div>
  );
}
