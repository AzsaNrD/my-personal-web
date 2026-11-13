import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isOwnerKey, userKey } from '@/lib/is-owner';

export async function GET() {
  const session = await auth();
  const owner = isOwnerKey(userKey(session?.user?.provider, session?.user?.providerAccountId));
  return NextResponse.json({ owner }, { headers: { 'Cache-Control': 'private, no-store' } });
}
