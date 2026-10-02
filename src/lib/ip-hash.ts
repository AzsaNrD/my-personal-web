import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

export const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

/** Salted hash of the caller's IP for rate limiting; the raw address is never stored. */
export async function getIpHash(): Promise<string | null> {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip');
  return ip ? sha256(`${process.env.AUTH_SECRET ?? ''}:${ip}`) : null;
}
