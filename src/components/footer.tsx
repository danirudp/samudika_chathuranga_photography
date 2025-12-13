'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowRight, Camera } from 'lucide-react';
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
  { text: 'Facebook', href: '#' },
  { text: 'Instagram', href: '#' },
  { text: 'LinkedIn', href: '#' },
  { text: 'WhatsApp', href: '#' },
];

const EXPLORE_LINKS = [
  { label: 'Home', target: 'top' },
  { label: 'Portfolio', target: '#portfolio' },
  { label: 'About', target: '#about' },
  { label: 'Stories', target: '#stories' },
];

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const smoothY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  const yContent = useTransform(smoothY, [0, 1], [-50, 0]);

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
      className="relative w-full bg-[#0f0f11] pt-20 md:pt-32 pb-8 px-4 md:px-12 lg:px-24 overflow-hidden border-t border-white/5"
    >
      {/* Background Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] will-change-transform"></div>

      <motion.div
        style={{ y: yContent }}
        className="relative z-10 flex flex-col h-full justify-between will-change-transform"
      >
        {/* 1. THE BIG HEADER (CTA) */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-12 mb-20 md:mb-32 border-b border-white/10 pb-16 md:pb-24 text-center md:text-left">
          <div className="max-w-4xl relative flex flex-col items-center md:items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="hidden md:block h-[1px] w-12 bg-white/30"></div>
              <span className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-white/50">
                The Next Chapter
              </span>
              <div className="md:hidden h-[1px] w-12 bg-white/30"></div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl lg:text-9xl text-white leading-[0.9] tracking-tight"
            >
              Ready to tell <br className="hidden md:block" />
              <span className="text-white/40 italic">your story?</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:mb-4"
          >
            <Link href="/contact" className="group block relative">
              <div className="relative h-18 w-18 md:h-28 md:w-28 rounded-full border border-white/20 flex items-center justify-center overflow-hidden bg-white/5 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105 group-hover:border-white/40">
                <div className="absolute inset-0 bg-white translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"></div>
                <ArrowRight className="relative z-10 w-8 h-8 md:w-10 md:h-10 text-white transition-colors duration-500 group-hover:text-black -rotate-45 group-hover:rotate-0" />
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 whitespace-nowrap font-sans text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                Book Now
              </span>
            </Link>
          </motion.div>
        </div>

        {/* 2. THE BALANCED DATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          {/* A. Brand (Span 4) */}
          <div className="md:col-span-4 flex flex-col gap-6 items-center text-center md:items-start md:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                <Camera size={18} />
              </div>
              <span className="font-serif italic text-2xl text-white">
                Samudika Chathuranga Photography
              </span>
            </div>
            <p className="font-sans text-white/40 text-sm leading-relaxed max-w-xs">
              Capturing the unscripted, raw, and timeless moments of your life.
              Based in Sri Lanka, Available Islandwide.
            </p>
          </div>

          {/* B. Navigation & Socials Group (Span 4) */}
          <div className="md:col-span-4 w-full">
            <div className="grid grid-cols-2 gap-4 md:gap-12 w-full max-w-md mx-auto md:mx-0 border-t border-b border-white/5 py-8 md:py-0 md:border-none">
              {/* Explore Column */}
              <div className="flex flex-col gap-6 pl-4 md:pl-12 border-r border-white/5 md:border-r-0 md:border-l">
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
              </div>

              {/* Socials Column */}
              <div className="flex flex-col gap-6 pl-8 md:pl-12 border-l border-white/5 md:border-none">
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
              </div>
            </div>
          </div>

          {/* C. Contact (Span 4) */}
          <div className="md:col-span-4 flex flex-col gap-8 items-center text-center md:items-end md:text-right">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/30 mb-4 block">
                Inquiries
              </span>
              <a
                href="mailto:samudikadj@gmail.com"
                className="font-serif text-2xl md:text-1xl text-white hover:text-white/70 transition-colors block"
              >
                samudikadj@gmail.com
              </a>
              <a
                href="tel:+94703258550"
                className="font-serif text-2xl md:text-1xl text-white hover:text-white/70 transition-colors block"
              >
                070 325 8550
              </a>
            </div>
            <div>
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
            </div>
          </div>
        </div>

        {/* 3. BOTTOM COPYRIGHT */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-white/20 font-sans">
          <span>©2025 Samudika Chathuranga Photography</span>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-white transition-colors">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-white transition-colors">
              Terms & Conditions
            </span>
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
      className="group flex items-center gap-2 w-fit text-left"
    >
      <span className="hidden md:block h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-4"></span>
      <span className="font-sans text-sm text-white/60 group-hover:text-white transition-colors">
        {label}
      </span>
    </button>
  );
}

function ExternalLink({ href, text }: ExternalLinkProps) {
  return (
    <Link href={href} className="group flex items-center gap-2 w-fit">
      <span className="hidden md:block h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-4"></span>
      <span className="font-sans text-sm text-white/60 group-hover:text-white transition-colors">
        {text}
      </span>
    </Link>
  );
}
