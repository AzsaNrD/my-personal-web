import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { sha256 } from '@/lib/ip-hash';

const COOKIE = 'gb_guest';
const ONE_YEAR_S = 60 * 60 * 24 * 365;

/** The current guest's stored key, or null when they have never posted. Only the hash is persisted. */
export async function getGuestKey(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? `guest:${sha256(token)}` : null;
}

/** Like `getGuestKey`, but issues the cookie on first use. Server actions only. */
export async function ensureGuestKey(): Promise<string> {
  const jar = await cookies();
  let token = jar.get(COOKIE)?.value;
  if (!token) {
    token = randomBytes(24).toString('hex');
    jar.set(COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ONE_YEAR_S,
    });
  }
  return `guest:${sha256(token)}`;
}
