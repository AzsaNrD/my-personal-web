import type { SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement> & {
  size?: number;
  monochrome?: boolean;
};

export function Logo({ size = 24, monochrome = false, ...props }: LogoProps) {
  const stroke = monochrome ? 'currentColor' : 'url(#logo-gradient)';
  const fill = monochrome ? 'currentColor' : 'url(#logo-gradient)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      {!monochrome && (
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f8bff" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      )}
      <ellipse
        cx="32"
        cy="32"
        rx="28"
        ry="9"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        transform="rotate(-25 32 32)"
      />
      <path
        d="M16 50 L30 14 L34 14 L48 50 L42 50 L38 40 L26 40 L22 50 Z M28 34 L36 34 L32 22 Z"
        fill={fill}
      />
      <circle cx="56" cy="22" r="3.5" fill={fill} />
    </svg>
  );
}
