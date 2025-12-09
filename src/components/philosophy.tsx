'use client';

import {
  BezierDefinition,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  Variants,
} from 'framer-motion';
import Image from 'next/image';
import { useRef, type MouseEvent } from 'react';

// --- CONFIGURATION ---
const PHOTOGRAPHER_IMAGE =
  'https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=2070&auto=format&fit=crop';
const EASE_LUXURY: BezierDefinition = [0.33, 1, 0.68, 1];

// --- ANIMATION VARIANTS ---
const textReveal: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      delay: i * 0.1,
      ease: EASE_LUXURY,
    },
  }),
};

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);

  // --- PHYSICS ENGINE ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yText = useTransform(scrollYProgress, [0, 1], [50, -50]); // Reduced movement for mobile stability

  // 3D Mouse Tilt (Desktop Only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // Only run on desktop (width > 768px) to save mobile resources
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    stiffness: 50,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 50,
    damping: 20,
  });
  const brightness = useSpring(useTransform(mouseY, [-0.5, 0.5], [1, 1.2]), {
    stiffness: 50,
    damping: 20,
  });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#0f0f11] py-24 md:py-32 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-16 lg:gap-32 overflow-hidden perspective-1000"
      style={{ perspective: '1500px' }}
    >
      {/* 1. THE IMAGE COLUMN (Interactive 3D) */}
      <div
        className="relative w-full md:w-1/2 h-[50vh] md:h-[90vh] flex items-center justify-center group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
      >
        {/* Backlight Glow (Desktop Only) */}
        <div className="hidden md:block absolute inset-0 bg-white/5 blur-[100px] rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

        <motion.div
          style={{
            y: yImage,
            rotateX: rotateX,
            rotateY: rotateY,
            filter: useTransform(brightness, (b) => `brightness(${b})`),
          }}
          className="relative h-full w-full rounded-sm overflow-hidden shadow-2xl shadow-black/50 will-change-transform preserve-3d"
        >
          {/* Inner Reveal Wrapper */}
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }} // Trigger earlier on mobile
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="relative h-full w-full"
          >
            <Image
              src={PHOTOGRAPHER_IMAGE}
              alt="The Invisible Observer"
              fill
              className="object-cover opacity-80 md:opacity-60 md:transition-all md:duration-1000 md:group-hover:grayscale-0 md:group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Cinematic Noise & Vignette */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent opacity-80 md:opacity-60"></div>
          </motion.div>

          {/* Glass Reflection sheen (Desktop) */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        </motion.div>
      </div>

      {/* 2. THE TEXT COLUMN (Responsive Layout) */}
      <motion.div
        style={{ y: yText }}
        className="w-full md:w-1/2 flex flex-col justify-center z-10 md:-ml-24 pointer-events-none mix-blend-normal mt-[-50px] md:mt-0"
      >
        {/* Label */}
        <motion.p
          custom={0}
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-sans text-xs uppercase tracking-[0.4em] text-white/40 mb-6 md:mb-8 flex items-center gap-4"
        >
          <span className="h-[1px] w-12 bg-white/20"></span>
          The Philosophy
        </motion.p>

        {/* Liquid Metal Headline */}
        <div className="relative mb-8 md:mb-10">
          <motion.h3
            custom={1}
            variants={textReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white/90 bg-[length:200%_auto] animate-shimmer"
          >
            We capture the <br />
            <span className="italic font-light">silence</span> between <br />
            the <span className="italic font-light">heartbeats</span>
          </motion.h3>
        </div>

        {/* Body Text */}
        <motion.div
          custom={2}
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-sans text-white/60 text-base md:text-lg leading-relaxed max-w-md pl-6 border-l border-white/10 backdrop-blur-sm"
        >
          <p className="mb-6">
            Your wedding is not a photoshoot. It is a story unfolding in
            real-time. We blend into the background, becoming the invisible
            observers of your joy.
          </p>
          <p>
            No stiff poses. No forced smiles. Just the raw, unscripted elegance
            of two souls becoming one.
          </p>
        </motion.div>

        {/* Signature Block */}
        <motion.div
          custom={3}
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 md:mt-16 pl-8 flex flex-col gap-2 opacity-80"
        >
          <div className="h-[1px] w-20 bg-gradient-to-r from-white/40 to-transparent mb-4"></div>
          <p className="font-serif text-2xl md:text-3xl text-white italic">
            Samudika Chathuranga
          </p>
          <p className="font-sans text-[10px] uppercase tracking-widest text-white/30">
            Lead Photographer
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
