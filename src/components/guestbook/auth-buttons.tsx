import { signIn, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { GithubIcon, DiscordIcon, GoogleIcon } from '@/components/ui/brand-icons';
import { LogOut } from 'lucide-react';

type Provider = 'github' | 'discord' | 'google';

const PROVIDERS: {
  id: Provider;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { id: 'github', label: 'GitHub', icon: GithubIcon },
  { id: 'discord', label: 'Discord', icon: DiscordIcon },
  { id: 'google', label: 'Google', icon: GoogleIcon },
];

/** Three equal columns on phones (icon above the name); a wrapping row of full labels from `sm` up. */
export function SignInButtons({ redirectTo = '/guestbook' }: { redirectTo?: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap lg:grid">
      {PROVIDERS.map(({ id, label, icon: Icon }) => (
        <form
          key={id}
          action={async () => {
            'use server';
            await signIn(id, { redirectTo });
          }}
        >
          <Button
            type="submit"
            size="lg"
            variant="outline"
            aria-label={`Sign in with ${label}`}
            className="h-auto w-full flex-col gap-1.5 py-2.5 text-xs sm:h-9 sm:w-auto sm:flex-row sm:py-0 sm:text-sm lg:h-auto lg:w-full lg:flex-col lg:gap-1.5 lg:py-2.5 lg:text-xs"
          >
            <Icon size={16} />
            <span className="sm:hidden lg:inline">{label}</span>
            <span className="hidden sm:inline lg:hidden">Sign in with {label}</span>
          </Button>
        </form>
      ))}
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
      <Button type="submit" size="sm" variant="ghost" className="h-9 sm:h-7">
        <LogOut size={14} />
        Sign out
      </Button>
    </form>
  );
}
