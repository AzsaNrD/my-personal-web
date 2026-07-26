import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, profile, account }) {
      if (account && profile) {
        token.provider = account.provider;
        token.providerAccountId = String(profile.id ?? account.providerAccountId);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.provider = token.provider as 'github' | 'discord' | 'google' | undefined;
        session.user.providerAccountId = token.providerAccountId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/guestbook',
  },
});
