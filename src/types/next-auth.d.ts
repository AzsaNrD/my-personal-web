import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: 'github' | 'discord' | 'google';
      providerAccountId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: 'github' | 'discord' | 'google';
    providerAccountId?: string;
  }
}
