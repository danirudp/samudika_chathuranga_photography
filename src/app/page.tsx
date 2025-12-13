'use client';

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef, type MouseEvent } from 'react'; // Added MouseEvent type

// --- DYNAMIC IMPORTS ---
const HorizontalScroll = dynamic(
  () => import('@/components/horizontal-scroll'),
  {
    loading: () => <div className="h-screen bg-[#0f0f11]" />,
  }
);
const Philosophy = dynamic(() => import('@/components/philosophy'));
const LoveStories = dynamic(() => import('@/components/love-stories'));
// const Services = dynamic(() => import('@/components/services')); // Removed based on previous request
const Footer = dynamic(() => import('@/components/footer'));

export default function Home() {
  // TYPE SAFETY: Explicitly define the HTML Element type for refs.
  // This ensures 'containerRef.current' knows it is a DIV, providing correct autocomplete.
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Mouse Parallax State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth Scroll Physics
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // 1. THE FLYING ZOOM EFFECT
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const yImg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // The Text moves APART
  const yTextTop = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const yTextBottom = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Opacity fade out for "Flying through" feel
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // TYPE SAFETY: Strictly typed event handler
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  // Smooth springs for mouse movement
  const xSpring = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Text moves opposite to mouse (Depth)
  const textX = useTransform(xSpring, [-0.5, 0.5], ['20px', '-20px']);
  const textY = useTransform(ySpring, [-0.5, 0.5], ['20px', '-20px']);

  return (
    <main className="relative w-full bg-[#0f0f11]">
      {/* 1. CINEMATIC HERO SECTION */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative h-screen w-full overflow-hidden flex flex-col justify-between py-12 md:py-24"
      >
        {/* BACKGROUND GRAIN */}
        <div className="absolute inset-0 z-[1] opacity-[0.07] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* HERO IMAGE */}
        <motion.div
          style={{ scale: scaleImg, y: yImg, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=2070&auto=format&fit=crop"
              alt="Cinematic Wedding"
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
            {/* Vignette Overlay for Focus */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0f0f11]/20 to-[#0f0f11]/90"></div>
          </div>
        </motion.div>

        {/* TOP TEXT: SAMUDIKA */}
        <motion.div
          style={{ y: yTextTop, x: textX, opacity: opacityHero }}
          className="relative z-10 w-full px-4 md:px-12 mix-blend-overlay"
        >
          <div className="flex justify-between items-start border-t border-white/20 pt-4">
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-white/70"></span>
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-white/70 text-right hidden md:block">
              Est. 2018 | Ratnapura, LK
            </span>
          </div>

          <h1 className="font-serif text-[13vw] leading-[0.8] text-white tracking-tighter mt-4 text-center md:text-left">
            SAMUDIKA
          </h1>
        </motion.div>

        {/* CENTER ELEMENT: The "Lens" or Subtitle */}
        <motion.div
          style={{ opacity: opacityHero }}
          className="relative z-10 flex justify-center items-center"
        >
          <div className="backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 bg-white/5">
            <p className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-white/90">
              Fine Art Photography
            </p>
          </div>
        </motion.div>

        {/* BOTTOM TEXT: CHATHURANGA */}
        <motion.div
          style={{ y: yTextBottom, x: textX, opacity: opacityHero }}
          className="relative z-10 w-full px-4 md:px-12 mix-blend-overlay"
        >
          <h1 className="font-serif text-[13vw] leading-[0.8] text-white tracking-tighter mb-4 text-center md:text-right">
            CHATHURANGA
          </h1>

          <div className="flex justify-center md:justify-between items-end border-b border-white/20 pb-4">
            {/* Scroll Indicator */}
            <div className="flex flex-col items-center animate-bounce-slow">
              <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white/50"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. MAIN CONTENT (Ref) */}
      <div ref={containerRef} className="relative z-20 bg-[#0f0f11]">
        <div id="portfolio">
          <HorizontalScroll />
        </div>

        <div id="about">
          <Philosophy />
        </div>

        <div id="stories">
          <LoveStories />
        </div>

        <div id="contact">
          <Footer />
        </div>
      </div>
    </main>
  );
}
