'use client';

import { LenisProps, ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

// --- TYPES ---
interface SmoothScrollProps extends Omit<LenisProps, 'root'> {
  children: ReactNode;
}

// --- CONFIGURATION ---
// Senior Polish: Centralized physics config.
// lerp: 0.08 -> The "Golden Ratio" for luxury feel (not too draggy, not too twitchy).
const SCROLL_OPTIONS = {
  lerp: 0.08,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1,
  // infinite: false, // Can be toggled for infinite scroll layouts
};

export default function SmoothScroll({
  children,
  ...props
}: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={SCROLL_OPTIONS}
      {...props} // Allows overriding options or adding event listeners from parent
    >
      {children}
    </ReactLenis>
  );
}
