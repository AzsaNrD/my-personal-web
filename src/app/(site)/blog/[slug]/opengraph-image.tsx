import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/mdx';
import { siteConfig } from '@/lib/site-config';
import { formatDate } from '@/lib/utils';

// Runs on Node (not edge) because reading post files needs the filesystem.
export const alt = 'Blog post';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? 'Writings';
  const meta = post ? `${formatDate(post.date)} · ${post.readingMinutes} min read` : siteConfig.url;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background:
          'radial-gradient(circle at 12% 18%, rgba(52,211,153,0.20) 0%, transparent 55%), #07080a',
        color: '#fafafa',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 6, height: 30, backgroundColor: '#34d399' }} />
        <div style={{ display: 'flex', fontSize: 26, fontWeight: 700 }}>
          <span>azsa</span>
          <span style={{ color: '#34d399' }}>-nrd</span>
        </div>
        <span style={{ color: '#52525b', fontSize: 24 }}>/</span>
        <span style={{ color: '#a1a1aa', fontSize: 24, letterSpacing: 4 }}>BLOG</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 48 ? 60 : 72,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', color: '#34d399', fontSize: 24, marginTop: 28 }}>{meta}</div>
      </div>
    </div>,
    size,
  );
}
