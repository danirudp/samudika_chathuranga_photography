'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowUpRight, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

// --- TYPES ---
interface FooterLinkProps {
  label: string;
  onClick: () => void;
}

interface ExternalLinkProps {
  href: string;
  text: string;
}

// --- CONSTANTS ---
const SOCIAL_LINKS = [
  { text: 'Instagram', href: '#' },
  { text: 'Twitter', href: '#' },
  { text: 'LinkedIn', href: '#' },
  { text: 'Pinterest', href: '#' },
];

const EXPLORE_LINKS = [
  { label: 'Home', target: 'top' },
  { label: 'Portfolio', target: '#portfolio' },
  { label: 'Stories', target: '#stories' },
  { label: 'About', target: '#about' },
];

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // Scroll Physics
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const smoothY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  // Parallax Content
  const yContent = useTransform(smoothY, [0, 1], [-100, 0]);

  const handleScroll = (target: string) => {
    if (lenis) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  return (
    <footer
      ref={containerRef}
      className="relative w-full bg-[#0f0f11] pt-32 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5"
    >
      {/* Background Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] will-change-transform"></div>

      {/* 1. INFINITE MARQUEE (Visual Divider) */}
      <div className="absolute top-10 left-0 w-full overflow-hidden opacity-20 pointer-events-none select-none">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
          className="flex whitespace-nowrap gap-10"
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-[10vw] font-serif leading-none stroke-text tracking-tighter"
            >
              SAMUDIKA CHATHURANGA
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        style={{ y: yContent }}
        className="relative z-10 flex flex-col h-full justify-between will-change-transform pt-24"
      >
        {/* 2. THE BIG HEADER (CTA) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-32 border-b border-white/10 pb-20">
          <div className="max-w-4xl relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[1px] w-12 bg-white/30"></div>
              <span className="font-sans text-xs uppercase tracking-[0.4em] text-white/50">
                The Next Chapter
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tight mix-blend-overlay"
            >
              Ready to tell <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white/90 animate-shimmer bg-[length:200%_auto] italic">
                your story?
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:mb-4 self-end md:self-auto"
          >
            <Link
              href="/contact"
              className="group relative flex h-20 w-20 md:h-30 md:w-30 items-center justify-center rounded-full bg-white transition-all duration-500 hover:scale-110 focus-ring"
              aria-label="Start your project"
            >
              <span className="relative z-10 font-sans text-xs font-bold uppercase tracking-widest text-black group-hover:hidden">
                Let's Talk
              </span>
              <ArrowUpRight className="hidden h-12 w-12 text-black transition-transform duration-500 group-hover:block group-hover:-rotate-45 group-hover:scale-125" />
            </Link>
          </motion.div>
        </div>

        {/* 3. THE ARCHITECTURAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
          {/* A. Brand (Span 4) */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <Link
              href="/"
              className="flex items-center gap-3 focus-ring rounded-lg w-fit"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                <Camera size={20} />
              </div>
              <span className="font-serif text-3xl text-white">
                Samudika Chathuranga Photography
              </span>
            </Link>
            <p className="font-sans text-white/40 text-sm leading-relaxed max-w-sm">
              Capturing the unscripted, raw, and timeless moments of your life.
              Based in Sri Lanka, Available Islandwide.
            </p>
          </div>

          {/* B. Navigation & Socials Group (Span 4) */}
          <div className="md:col-span-4 w-full">
            <div className="grid grid-cols-2 gap-12 border-l border-white/5 pl-8 md:pl-12">
              {/* Explore Column */}
              <nav
                className="flex flex-col gap-6"
                aria-label="Footer Navigation"
              >
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/30">
                  Explore
                </span>
                <div className="flex flex-col gap-3">
                  {EXPLORE_LINKS.map((link) => (
                    <FooterLink
                      key={link.label}
                      label={link.label}
                      onClick={() => handleScroll(link.target)}
                    />
                  ))}
                </div>
              </nav>

              {/* Socials Column */}
              <nav className="flex flex-col gap-6" aria-label="Social Media">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/30">
                  Socials
                </span>
                <div className="flex flex-col gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <ExternalLink
                      key={link.text}
                      href={link.href}
                      text={link.text}
                    />
                  ))}
                </div>
              </nav>
            </div>
          </div>

          {/* C. Contact (Span 4) */}
          <div className="md:col-span-4 flex flex-col gap-8 md:items-end md:text-right border-t md:border-t-0 md:border-l border-white/5 pt-12 md:pt-0 md:pl-12">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/30 mb-4 block">
                Inquiries
              </span>
              <a
                href="mailto:djsamudika@gmail.com"
                className="font-serif text-2xl md:text-4xl text-white hover:text-white/60 transition-colors block focus-ring rounded-lg"
              >
                djsamudika@gmail.com
              </a>
            </div>
            <address className="not-italic">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/30 mb-4 block">
                Studio
              </span>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                No 55, Morathota, Opanayake
                <br />
                Ratnapura, Sabaragamuwa
                <br />
                Sri Lanka
              </p>
            </address>
          </div>
        </div>

        {/* 4. BOTTOM COPYRIGHT */}
        <div className="border-t border-white/5 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-white/20 font-sans">
          <span>© 2025 Samudika Chathuranga Photography</span>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="cursor-pointer hover:text-white transition-colors focus-ring rounded-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="cursor-pointer hover:text-white transition-colors focus-ring rounded-sm"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

// --- SUB-COMPONENTS ---

function FooterLink({ label, onClick }: FooterLinkProps) {
  return (
    <button
      onClick={onClick}
      className="focus-ring group flex items-center gap-2 w-fit text-left rounded-sm"
    >
      <span className="h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-4"></span>
      <span className="font-sans text-sm text-white/60 group-hover:text-white transition-colors">
        {label}
      </span>
    </button>
  );
}

function ExternalLink({ href, text }: ExternalLinkProps) {
  return (
    <Link
      href={href}
      className="focus-ring group flex items-center gap-2 w-fit rounded-sm"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-4"></span>
      <span className="font-sans text-sm text-white/60 group-hover:text-white transition-colors">
        {text}
      </span>
    </Link>
  );
}
