import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { isOwnerKey, userKey } from '@/lib/is-owner';
import { NewPostForm } from '@/components/admin/new-post-form';
import { PageHeader } from '@/components/layouts/page-header';

async function isOwnerSession(): Promise<boolean> {
  const session = await auth();
  return isOwnerKey(userKey(session?.user?.provider, session?.user?.providerAccountId));
}

// Mirror the not-found title when unauthorized so the route's existence doesn't leak via metadata.
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
