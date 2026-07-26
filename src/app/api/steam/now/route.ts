import { NextResponse } from 'next/server';
import { getSteamPlayer } from '@/lib/integrations/steam';

export const revalidate = 60;

export async function GET() {
  try {
    const player = await getSteamPlayer();
    return NextResponse.json({ player });
  } catch {
    return NextResponse.json({ player: null }, { status: 200 });
  }
}
