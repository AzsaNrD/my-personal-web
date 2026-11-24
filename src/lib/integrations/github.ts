import { siteConfig } from '@/lib/site-config';

/** Public repository count for the profile in `siteConfig.links.github`, or null if unavailable. */
export async function getPublicRepoCount(): Promise<number | null> {
  const username = new URL(siteConfig.links.github).pathname.split('/').filter(Boolean)[0];
  if (!username) return null;
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'personal-site' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { public_repos?: number };
    return typeof data.public_repos === 'number' ? data.public_repos : null;
  } catch {
    return null;
  }
}
