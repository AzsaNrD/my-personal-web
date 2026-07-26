import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { SignInButtons, SignOutButton } from '@/components/guestbook/auth-buttons';
import { GuestbookForm } from '@/components/guestbook/guestbook-form';
import { GuestbookList } from '@/components/guestbook/guestbook-list';
import { GithubIcon, DiscordIcon, GoogleIcon } from '@/components/ui/brand-icons';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/layouts/page-header';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'A little corner for visitors to leave a message, share feedback, or just say hi.',
};

export default async function GuestbookPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <section className="py-12">
      <PageHeader
        eyebrow="Guestbook"
        jp="ゲストブック"
        title="Guestbook"
        description="Want to drop a message or say hi? Sign in to leave a message, and you can choose to post anonymously if you'd rather keep your name hidden."
      />

      <div className="border-border bg-card rounded-xl border p-5">
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

            <GuestbookForm />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Not signed in. Pick one:</p>
            <SignInButtons />
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">
          Messages from visitors
        </h2>
        <div className="mt-4">
          <Suspense fallback={<GuestbookListSkeleton />}>
            <GuestbookList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function GuestbookListSkeleton() {
  return (
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
  );
}
