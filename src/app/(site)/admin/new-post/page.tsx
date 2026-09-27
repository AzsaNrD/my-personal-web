import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { siteConfig } from '@/lib/site-config';
import { NewPostForm } from '@/components/admin/new-post-form';
import { PageHeader } from '@/components/layouts/page-header';

const OWNER_IDS = new Set(siteConfig.ownerIds);

async function isOwnerSession(): Promise<boolean> {
  const session = await auth();
  const user = session?.user;
  const userKey =
    user?.provider && user?.providerAccountId ? `${user.provider}:${user.providerAccountId}` : null;
  return userKey !== null && OWNER_IDS.has(userKey);
}

// Metadata mirrors the real not-found page when unauthorized, so the route's
// existence doesn't leak through the page title before the notFound() render.
export async function generateMetadata(): Promise<Metadata> {
  if (!(await isOwnerSession())) {
    return { title: '404 · Not Found' };
  }
  return {
    title: 'New post',
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    alternates: { canonical: undefined },
  };
}

export default async function NewPostPage() {
  if (!(await isOwnerSession())) {
    notFound();
  }

  return (
    <div className="py-12">
      <PageHeader
        eyebrow="Admin"
        jp="管理"
        title="New post"
        description="Publishes straight to the blog by committing a new .mdx file to the repo. The deploy takes a minute or two after that."
      />
      <div className="mt-8">
        <NewPostForm />
      </div>
    </div>
  );
}
