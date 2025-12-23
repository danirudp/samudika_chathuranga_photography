'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

// --- CONSTANTS & CONFIG ---
const PHOTOGRAPHER_IMAGE = '/portfolio/14.webp';

// "Luxury" Easing Curve (Bezier)
const EASE_LUXURY = [0.33, 1, 0.68, 1];

// Animation Variants (Separation of Concerns)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: customDelay,
      ease: EASE_LUXURY,
    },
  }),
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.2 },
  visible: {
    opacity: 1,
    scale: 1.1,
    transition: { duration: 1.4, ease: 'easeOut' },
  },
};

export default function Philosophy() {
  // TYPE SAFETY: Explicit ref type
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // PARALLAX LOGIC
  // Image moves slightly slower than scroll (Depth)
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -50]);
  // Text moves slightly faster/opposite (Overlap)
  const yText = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#0f0f11] py-32 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-12 lg:gap-24 overflow-hidden"
    >
      {/* 1. THE IMAGE COLUMN */}
      <div className="relative w-full md:w-1/2 h-[60vh] md:h-[90vh]">
        <div className="relative h-full w-full overflow-hidden rounded-sm bg-white/5">
          <motion.div
            style={{ y: yImage, scale: 1.1 }}
            variants={imageReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative h-[120%] w-full will-change-transform"
          >
            <Image
              src={PHOTOGRAPHER_IMAGE}
              alt="Cinematic Wedding Moment"
              fill
              className="object-cover opacity-80 grayscale transition-all duration-1000 hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
          </motion.div>
        </div>
      </div>

      {/* 2. THE TEXT COLUMN */}
      <motion.div
        style={{ y: yText }}
        className="w-full md:w-1/2 flex flex-col justify-center z-10 md:-ml-12 pointer-events-none"
      >
        {/* Label */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-sans text-xs uppercase tracking-[0.4em] text-white/40 mb-8 flex items-center gap-4"
        >
          <span className="h-[1px] w-12 bg-white/20"></span>
          The Philosophy
        </motion.p>

        {/* Headline */}
        <h3 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.95] text-white mb-10 mix-blend-difference">
          <span className="block">Let memories </span>
          <span className="block italic text-white/50 pl-12">be framed</span>
          <span className="block">in time,</span>
          <span className="block italic text-white/50 pl-8">
            just smiles are
          </span>
          <span className="block">frozen in light.</span>
        </h3>

        {/* Body Text */}
        <motion.div
          variants={fadeInUp}
          custom={0.2} // Delay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-sans text-white/60 text-lg leading-relaxed max-w-md pl-2 border-l border-white/10"
        >
          <p className="mb-6 pl-6">
            Your wedding is not a photoshoot. It is a story unfolding in
            real-time. We blend into the background, becoming the invisible
            observers of your joy.
          </p>
          <p className="pl-6">
            No stiff poses. No forced smiles. Just the raw, unscripted elegance
            of two souls becoming one.
          </p>
        </motion.div>

        {/* Signature Block */}
        <motion.div
          variants={fadeInUp}
          custom={0.4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 pl-8 flex flex-col gap-2"
        >
          <div className="h-[1px] w-16 bg-white/20 mb-4"></div>
          <p className="font-sans text-2xl text-white">Samudika Chathuranga</p>
          <p className="font-sans text-[10px] uppercase tracking-widest text-white/30">
            Lead Photographer
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
