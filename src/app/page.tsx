'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState, type MouseEvent } from 'react'; // Added useState, useEffect

// --- DYNAMIC IMPORTS ---
const HorizontalScroll = dynamic(
  () => import('@/components/horizontal-scroll'),
  {
    loading: () => <div className="h-screen bg-[#0f0f11]" />,
  }
);
const Philosophy = dynamic(() => import('@/components/philosophy'));
const LoveStories = dynamic(() => import('@/components/love-stories'));
const Footer = dynamic(() => import('@/components/footer'));

// Define type for particle positions
interface Particle {
  left: number;
  top: number;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // FIX: Store random particles in state so they are stable after hydration
  const [particles, setParticles] = useState<Particle[]>([]);

  // --- 1. MOUSE PHYSICS (The Spotlight) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  // 2. THE SPOTLIGHT GRADIENT
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent 80%)`;

  // 3. 3D TILT PHYSICS
  const xSpring = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const ySpring = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(ySpring, [0, 1000], [5, -5]);
  const rotateY = useTransform(xSpring, [0, 1500], [-5, 5]);

  // --- 4. SCROLL PHYSICS ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const yImg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const yTextTop = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);
  const yTextBottom = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // FIX: Generate random particles ONLY on the client side
  useEffect(() => {
    const generatedParticles = [...Array(6)].map(() => ({
      left: Math.random() * 100,
      top: 80 + Math.random() * 20,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <main className="relative w-full bg-[#0f0f11]">
      {/* 1. CINEMATIC HERO SECTION */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative h-screen w-full overflow-hidden flex flex-col justify-between py-12 md:py-24 perspective-1000"
        style={{ perspective: '1200px' }}
      >
        {/* --- LAYER 0: GLOBAL ATMOSPHERE --- */}
        <motion.div
          className="absolute inset-0 z-[2] opacity-50 pointer-events-none mix-blend-overlay"
          style={{ background: spotlight }}
        />

        {/* Grain */}
        <div className="absolute inset-0 z-[1] opacity-[0.06] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* --- LAYER 1: THE HERO IMAGE --- */}
        <motion.div
          style={{
            scale: scaleImg,
            y: yImg,
            opacity: opacityHero,
            rotateX: rotateX,
            rotateY: rotateY,
          }}
          className="absolute inset-0 z-0 will-change-transform"
        >
          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=2070&auto=format&fit=crop"
              alt="Cinematic Wedding"
              fill
              className="object-cover opacity-60 transition-all duration-700"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-radial-gradient from-[#0f0f11]/10 via-[#0f0f11]/40 to-[#0f0f11]"></div>
          </div>
        </motion.div>

        {/* --- LAYER 2: THE TYPOGRAPHY --- */}

        {/* TOP TEXT */}
        <motion.div
          style={{ y: yTextTop, opacity: opacityHero }}
          className="relative z-10 w-full px-4 md:px-12 mix-blend-color-dodge"
        >
          <div className="flex justify-between items-start border-t border-white/20 pt-4 mb-2">
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-white/60">
              Est. 2018
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-white/60 text-right hidden md:block">
              Sri Lanka
            </span>
          </div>

          <h1 className="font-serif text-[13vw] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 tracking-tighter mt-4 text-center md:text-left drop-shadow-2xl opacity-50">
            SAMUDIKA
          </h1>
        </motion.div>

        {/* CENTER: 3D FLOATING PARTICLES */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: -100 - Math.random() * 200,
                opacity: [0, 0.5, 0],
                x: Math.random() * 50 - 25,
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
              className="absolute h-1 w-1 bg-white rounded-full blur-[1px]"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
            />
          ))}
        </div>

        {/* CENTER BADGE */}
        <motion.div
          style={{ opacity: opacityHero }}
          className="relative z-10 flex justify-center items-center"
        >
          <div className="backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.08)] group cursor-crosshair">
            <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.35em] text-white group-hover:text-white/80 transition-colors">
              Fine Art Photography
            </p>
          </div>
        </motion.div>

        {/* BOTTOM TEXT */}
        <motion.div
          style={{ y: yTextBottom, opacity: opacityHero }}
          className="relative z-10 w-full px-4 md:px-12 mix-blend-color-dodge"
        >
          <h1 className="font-serif text-[13vw] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-t from-white via-white/80 to-white/20 tracking-tighter mb-4 text-center md:text-right drop-shadow-2xl opacity-50">
            CHATHURANGA
          </h1>

          <div className="flex justify-center md:justify-between items-end border-b border-white/20 pb-4">
            <div className="hidden md:flex gap-8">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
                Instagram
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
                Facebook
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/30">
                Scroll
              </span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. MAIN CONTENT (Ref for scrolling) */}
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
