import { siteConfig } from '@/lib/site-config';

const OWNER_IDS = new Set(siteConfig.ownerIds);

/** Builds the `provider:providerAccountId` key used to identify a user across the app. */
export function userKey(
  provider?: string | null,
  providerAccountId?: string | null,
): string | null {
  return provider && providerAccountId ? `${provider}:${providerAccountId}` : null;
}

export function isOwnerKey(key: string | null): boolean {
  return key !== null && OWNER_IDS.has(key);
}
