import { signIn, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { GithubIcon, DiscordIcon, GoogleIcon } from '@/components/ui/brand-icons';
import { LogOut } from 'lucide-react';

export function SignInButtons({ redirectTo = '/guestbook' }: { redirectTo?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <form
        action={async () => {
          'use server';
          await signIn('github', { redirectTo });
        }}
      >
        <Button type="submit" size="lg" variant="outline">
          <GithubIcon size={16} />
          Sign in with GitHub
        </Button>
      </form>
      <form
        action={async () => {
          'use server';
          await signIn('discord', { redirectTo });
        }}
      >
        <Button type="submit" size="lg" variant="outline">
          <DiscordIcon size={16} />
          Sign in with Discord
        </Button>
      </form>
      <form
        action={async () => {
          'use server';
          await signIn('google', { redirectTo });
        }}
      >
        <Button type="submit" size="lg" variant="outline">
          <GoogleIcon size={16} />
          Sign in with Google
        </Button>
      </form>
    </div>
  );
}

export function SignOutButton({ redirectTo = '/guestbook' }: { redirectTo?: string }) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo });
      }}
    >
      <Button type="submit" size="sm" variant="ghost">
        <LogOut size={14} />
        Sign out
      </Button>
    </form>
  );
}
