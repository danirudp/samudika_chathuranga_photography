'use client';

import Navbar from '@/components/navbar';
import Preloader from '@/components/preloader';
import SmoothScroll from '@/components/smooth-scroll';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import './globals.css';

// --- TYPE DEFINITIONS ---
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate asset loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0); // Ensure user starts at the top
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* SENIOR FIX: Load fonts via HTML to prevent CSS parser errors during build */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-[#0f0f11] text-white antialiased selection:bg-orange-100 selection:text-orange-900 font-sans">
        {/* 1. CINEMATIC PRELOADER */}
        <AnimatePresence mode="wait">
          {isLoading && <Preloader />}
        </AnimatePresence>

        {/* 2. SMOOTH SCROLL CONTEXT */}
        <SmoothScroll>
          {/* 3. GLOBAL NOISE OVERLAY */}
          {/* Performance Win: Rendered once here, covers entire app */}
          <div className="fixed inset-0 z-[1] opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] will-change-transform"></div>

          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
