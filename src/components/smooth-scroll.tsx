'use client';

import { LenisProps, ReactLenis } from 'lenis/react';
import { ReactNode, useEffect, useState } from 'react';

// --- TYPES ---
interface SmoothScrollProps extends Omit<LenisProps, 'root'> {
  children: ReactNode;
}

// --- CONFIGURATION ---
const SCROLL_OPTIONS = {
  lerp: 0.08,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1,
};

export default function SmoothScroll({
  children,
  ...props
}: SmoothScrollProps) {
  // 1. STATE: Track if we are on a mobile device
  // We start as 'false' so the server rendering matches the initial client paint
  const [isMobile, setIsMobile] = useState(false);

  // 2. EFFECT: Check screen size strictly on the client side
  useEffect(() => {
    const checkMobile = () => {
      // 768px is the standard breakpoint for tablets/mobiles
      setIsMobile(window.innerWidth < 768);
    };

    // Run the check immediately on mount
    checkMobile();

    // (Optional) Re-check if the user resizes/rotates their screen
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3. THE GUARD: If mobile, return children WITHOUT the Lenis wrapper
  // This lets the phone use its native, fast hardware scrolling.
  if (isMobile) {
    return <>{children}</>;
  }

  // 4. DESKTOP: Render the luxury smooth scroll
  return (
    <ReactLenis root options={SCROLL_OPTIONS} {...props}>
      {children}
    </ReactLenis>
  );
}
