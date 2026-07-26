import { NextRequest, NextResponse } from 'next/server';
import { getRecentTracks } from '@/lib/integrations/lastfm';

export const revalidate = 30;

const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
  try {
    const raw = Number(req.nextUrl.searchParams.get('limit'));
    const limit = Number.isFinite(raw) && raw > 0 ? Math.min(raw, MAX_LIMIT) : DEFAULT_LIMIT;
    const tracks = await getRecentTracks(limit);
    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ tracks: [] }, { status: 200 });
  }
}
