/**
 * Last.fm serves the same cover at several fixed sizes ("34s", "64s", "174s", "300x300").
 * The API hands back the largest, so swap in the smallest size that still looks sharp.
 */
export function lastfmThumb(url: string, size: '64s' | '174s'): string {
  return url.replace(/\/(?:34s|64s|174s|300x300)\//, `/${size}/`);
}
