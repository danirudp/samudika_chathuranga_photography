import Navbar from '@/components/navbar';
import SmoothScroll from '@/components/smooth-scroll';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

// --- FONT CONFIGURATION ---
// FIXED: Added display: 'swap' to prevent Flash of Invisible Text (FOIT)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// --- TYPE DEFINITIONS ---
interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    template: '%s | Samudika Chathuranga Photography',
    default: 'Samudika Chathuranga | Fine Art Photography Sri Lanka',
  },
  description:
    'Professional wedding and fine art photographer based in Ratnapura, Sri Lanka. Capturing timeless love stories and cinematic moments since 2018.',
  keywords: [
    'wedding photography',
    'Sri Lanka photographer',
    'fine art photography',
    'Ratnapura',
    'destination wedding',
  ],
  authors: [{ name: 'Samudika Chathuranga' }],
  creator: 'Samudika Chathuranga',
  publisher: 'Samudika Chathuranga',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Samudika Chathuranga Photography',
    description: 'Capturing timeless love stories and cinematic moments.',
    url: 'https://samudika.netlify.app', // REPLACE WITH YOUR ACTUAL DOMAIN
    siteName: 'Samudika Chathuranga',
    images: [
      {
        url: '', // Make sure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: 'Samudika Chathuranga Photography Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  // REMOVED: The artificial 2000ms timeout/state.
  // This was causing unnecessary Main Thread Work on mobile.

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#0f0f11] text-white antialiased selection:bg-orange-100 selection:text-orange-900">
        <SmoothScroll>
          {/* 3. GLOBAL NOISE OVERLAY */}
          <div className="fixed inset-0 z-[1] opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
