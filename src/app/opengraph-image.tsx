import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site-config';

export const runtime = 'edge';
export const alt = `${siteConfig.name} | ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* Latin-only on purpose: the OG renderer would need a CJK font embedded for the
   site's Japanese accents, which is not worth the extra payload here. */
export default async function OpengraphImage() {
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
        <div style={{ width: 6, height: 34, backgroundColor: '#34d399' }} />
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700 }}>
          <span>azsa</span>
          <span style={{ color: '#34d399' }}>-nrd</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ width: 4, height: 20, backgroundColor: '#34d399' }} />
          <span style={{ color: '#34d399' }}>{siteConfig.role}</span>
          <span style={{ color: '#52525b' }}>/</span>
          <span style={{ color: '#a1a1aa' }}>{siteConfig.location}</span>
        </div>

        <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, marginTop: 18 }}>
          {siteConfig.name}
        </div>

        <div style={{ display: 'flex', color: '#a1a1aa', fontSize: 28, marginTop: 22 }}>
          {siteConfig.bio}
        </div>
      </div>
    </div>,
    size,
  );
}
