import localFont from 'next/font/local';
import { Inter, JetBrains_Mono } from 'next/font/google';

// Body — highly readable workhorse
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Display / headings — Clash Display (Fontshare, self-hosted).
// To try a different heading font, swap this loader; nothing else needs to change.
export const displayFont = localFont({
  src: [
    { path: '../app/fonts/clash/ClashDisplay-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../app/fonts/clash/ClashDisplay-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../app/fonts/clash/ClashDisplay-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
});

// Mono — meta only (dates, tags, view counts)
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
