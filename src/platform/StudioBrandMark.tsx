import React from 'react';

interface StudioBrandMarkProps {
  variant?: 'dark' | 'light';
  showSignature?: boolean;
  compact?: boolean;
}

/**
 * Definitive AV·STUDIO typographic SVG lockup (no HH, no extra monograms).
 * Uses `variant="light"` on dark (#171717) backgrounds and `variant="dark"` on ivory/white surfaces.
 */
export const StudioBrandMark: React.FC<StudioBrandMarkProps> = ({
  variant = 'dark',
  showSignature = false,
  compact = false,
}) => {
  const mainColor = variant === 'light' ? '#F3F0E9' : '#171717';
  const studioColor = variant === 'light' ? '#B8B5AE' : '#30302E';
  const accentColor = variant === 'light' ? '#C96F4A' : '#9E4A28';
  const ruleColor = variant === 'light' ? 'rgba(243, 240, 233, 0.22)' : 'rgba(23, 23, 23, 0.18)';

  return (
    <span className="inline-flex flex-col items-start gap-2 select-none">
      <svg
        viewBox="0 0 220 38"
        width={compact ? 136 : 156}
        height={compact ? 24 : 27}
        aria-hidden="true"
        className="block shrink-0"
      >
        <path
          fill={mainColor}
          fillRule="evenodd"
          d="M13.5 6H16.0L25.0 30.8H27.2V32H19.0V30.8H21.5L18.8 23.8H9.1L6.5 30.8H8.8V32H1.8V30.8H4.2L13.5 6ZM13.9 11.4L9.8 22.0H18.1L13.9 11.4Z"
        />
        <path
          fill={mainColor}
          d="M27.0 6H34.8V7.2H32.9L40.3 27.6L48.8 7.2H46.8V6H53.4V7.2H51.2L41.2 32H39.2L29.2 7.2H27.0V6Z"
        />
        <circle
          cx="65"
          cy="19"
          r="6.4"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.9"
          strokeOpacity="0.45"
        />
        <circle cx="65" cy="19" r="3.4" fill={accentColor} />
        <g
          fill="none"
          stroke={studioColor}
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <path d="M90.5 14C90.5 12.2 88.4 11.2 85.8 11.2C82.8 11.2 80.5 12.6 80.5 14.6C80.5 17.1 83.2 18.0 86.0 18.7C89.0 19.4 91.2 20.5 91.2 23.1C91.2 25.4 88.9 26.8 85.6 26.8C82.5 26.8 80.3 25.4 80.0 23.4" />
          <path d="M104 11.5H118M111 11.5V26.5" />
          <path d="M131 11.5V21C131 24.4 133.4 26.8 137 26.8C140.6 26.8 143 24.4 143 21V11.5" />
          <path d="M156.5 11.5H161.8C166.2 11.5 169.2 14.4 169.2 19C169.2 23.6 166.2 26.5 161.8 26.5H156.5Z" />
          <path d="M183 11.5V26.5" />
          <rect x="196" y="11.5" width="15" height="15" rx="7.5" />
        </g>
      </svg>

      {showSignature ? (
        <>
          <span className="flex w-44 items-center gap-1" aria-hidden="true">
            <span className="h-[1.5px] w-7 shrink-0" style={{ backgroundColor: accentColor }} />
            <span className="h-px flex-1" style={{ backgroundColor: ruleColor }} />
          </span>
          <span
            className="text-[0.6875rem] font-semibold tracking-[0.22em] whitespace-nowrap"
            style={{ color: studioColor }}
          >
            ANDERSON VALLEJO
          </span>
        </>
      ) : null}
    </span>
  );
};
