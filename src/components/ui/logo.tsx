import type { SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement> & {
  size?: number;
  /** Draw the mark as an outline in currentColor instead of the emerald tile. */
  monochrome?: boolean;
};

/**
 * Brand mark: a solid emerald tile with the "A" knocked out of it.
 * The filled silhouette is what keeps it legible down to favicon size.
 */
export function Logo({ size = 24, monochrome = false, ...props }: LogoProps) {
  const letter = monochrome ? 'currentColor' : '#07080a';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        fill={monochrome ? 'none' : '#34d399'}
        stroke={monochrome ? 'currentColor' : 'none'}
        strokeWidth="4"
      />
      <g stroke={letter} strokeWidth="7" strokeLinecap="square" fill="none">
        <path d="M16 50 L32 14 L48 50" />
        <path d="M24 39 L40 39" />
      </g>
    </svg>
  );
}
