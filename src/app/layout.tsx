'use client';

import Navbar from '@/components/navbar';
import Preloader from '@/components/preloader';
import SmoothScroll from '@/components/smooth-scroll';
import { AnimatePresence } from 'framer-motion';
import { Inter, Playfair_Display } from 'next/font/google';
import { useEffect, useState } from 'react';
import './globals.css';

// --- FONT CONFIGURATION ---
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

// --- TYPE DEFINITIONS ---
// Senior Polish: Defining an interface makes the component signature clean and extensible.
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

    // Cleanup function (Best Practice to prevent memory leaks)
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#0f0f11] text-white antialiased selection:bg-orange-100 selection:text-orange-900">
        {/* 1. CINEMATIC PRELOADER */}
        <AnimatePresence mode="wait">
          {isLoading && <Preloader />}
        </AnimatePresence>

        {/* 2. SMOOTH SCROLL CONTEXT */}
        <SmoothScroll>
          {/* 3. GLOBAL NOISE OVERLAY */}
          {/* Performance Win: Rendered once here, covers entire app */}
          <div className="fixed inset-0 z-[1] opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
