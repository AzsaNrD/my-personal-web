import { NextResponse } from 'next/server';
import { getViews, incrementView } from '@/lib/db/views';
import { getAllSlugs } from '@/lib/mdx';

const MAX_SLUG_LENGTH = 100;

async function isAllowedSlug(slug: string): Promise<boolean> {
  if (slug.length === 0 || slug.length > MAX_SLUG_LENGTH) return false;
  const slugs = await getAllSlugs();
  return slugs.includes(slug);
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await isAllowedSlug(slug))) {
    return NextResponse.json({ count: 0 }, { status: 400 });
  }
  try {
    const count = await getViews(slug);
    return NextResponse.json(
      { count },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    );
  } catch (error) {
    console.error('[views/get]', error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await isAllowedSlug(slug))) {
    return NextResponse.json({ count: 0 }, { status: 400 });
  }
  try {
    const count = await incrementView(slug);
    return NextResponse.json({ count });
  } catch (error) {
    console.error('[views/post]', error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
