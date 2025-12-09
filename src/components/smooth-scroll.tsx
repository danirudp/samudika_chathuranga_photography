'use client';

import { LenisProps, ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

interface SmoothScrollProps extends Omit<LenisProps, 'root'> {
  children: ReactNode;
}

const SCROLL_OPTIONS = {
  lerp: 0.08, // Luxury feel
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1,
};

export default function SmoothScroll({
  children,
  ...props
}: SmoothScrollProps) {
  return (
    <ReactLenis root options={SCROLL_OPTIONS} {...props}>
      {children}
    </ReactLenis>
  );
}
