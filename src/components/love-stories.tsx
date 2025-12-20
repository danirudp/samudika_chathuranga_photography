'use client';

import { ALL_STORIES, Story } from '@/lib/data';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  Variants,
} from 'framer-motion';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { memo, MouseEvent, useRef, useState } from 'react';

// --- ANIMATION VARIANTS ---
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function LoveStories() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ['0%', '100%']);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0f0f11] py-40 overflow-hidden"
      id="stories"
    >
      {/* 1. Header */}
      <div className="relative z-10 flex flex-col items-center text-center mb-56 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-6 mb-8"
        >
          <div className="h-[1px] w-12 bg-white/20"></div>
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-white/50 backdrop-blur-md">
            The Anthology
          </span>
          <div className="h-[1px] w-12 bg-white/20"></div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="font-serif text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 drop-shadow-2xl tracking-tight"
        >
          Selected{' '}
          <span className="italic font-light opacity-60 text-transparent bg-clip-text bg-gradient-to-r from-white/40 via-white to-white/40 animate-shimmer bg-[length:200%_auto]">
            Works
          </span>
        </motion.h2>
      </div>

      {/* 2. Timeline Spine */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 md:-translate-x-1/2 z-0">
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-gradient-to-b from-white/0 via-white/40 to-white/0 will-change-transform"
        ></motion.div>
      </div>

      {/* 3. Story List */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 perspective-1000">
        {ALL_STORIES.slice(0, 4).map((story, i) => (
          <StoryCard
            key={story.id}
            story={story}
            index={i}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        ))}
      </div>

      {/* 4. Footer Signature */}
      <div className="mt-40 flex flex-col items-center justify-center gap-6 opacity-30">
        <div className="h-24 w-[1px] bg-gradient-to-b from-white to-transparent"></div>
        <span className="font-serif text-white text-lg italic tracking-widest mix-blend-overlay">
          Fin.
        </span>
      </div>
    </section>
  );
}

// --- SUB-COMPONENT: STORY CARD (COLOR CORRECTED) ---
const StoryCard = memo(function StoryCard({
  story,
  index,
  hoveredIndex,
  setHoveredIndex,
}: {
  story: Story;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
}) {
  const isRight = story.align === 'right';
  const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

  // Physics (Desktop Only)
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 100,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 100,
    damping: 30,
  });

  const textX = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), {
    stiffness: 100,
    damping: 30,
  });
  const textY = useSpring(useTransform(y, [-0.5, 0.5], [-20, 20]), {
    stiffness: 100,
    damping: 30,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setHoveredIndex(null);
  }

  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent 80%)`;
  const borderLight = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.3), transparent 80%)`;

  return (
    <motion.article
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={`
        flex flex-col md:flex-row items-start md:items-center
        gap-8 md:gap-24 mb-24 md:mb-64 pl-8 md:pl-0
        ${isRight ? 'md:flex-row-reverse' : ''}
        transition-all duration-700 ease-out
        ${
          isDimmed
            ? 'md:opacity-20 md:blur-[2px] md:scale-95'
            : 'opacity-100 scale-100'
        }
      `}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={handleMouseLeave}
    >
      {/* A. IMAGE CONTAINER */}
      <div
        ref={ref}
        className="w-full md:w-1/2 group cursor-pointer perspective-1000 relative z-20"
        onMouseMove={handleMouseMove}
      >
        {/* Border Glow */}
        <motion.div
          style={{ background: borderLight, rotateX, rotateY }}
          className="hidden md:block absolute -inset-[1px] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 will-change-transform"
        />

        {/* 3D Container */}
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden rounded-sm bg-[#151515] shadow-2xl shadow-black/80 will-change-transform transform-3d z-10"
        >
          <div className="relative h-full w-full md:scale-105 md:transition-transform md:duration-1000 md:group-hover:scale-110">
            <Image
              src={story.image}
              alt={story.names}
              fill
              // Unified Style: Grayscale on Desktop, Color on Mobile
              className="object-cover opacity-80 md:opacity-60 grayscale-0 md:grayscale md:transition-all md:duration-700 md:ease-out md:group-hover:opacity-100 md:group-hover:grayscale-0"
              sizes="(max-width: 768px) 90vw, 50vw"
              quality={80}
              priority={index < 2}
            />
            {/* Atmosphere */}
            <div className="hidden md:block absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>
            {/* Spotlight */}
            <motion.div
              className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay pointer-events-none"
              style={{ background: spotlight }}
            />
          </div>
        </motion.div>
      </div>

      {/* B. INFO CONTAINER */}
      <div
        className={`w-full md:w-1/2 flex flex-col items-start ${
          isRight ? 'md:items-end md:text-right' : 'md:items-start md:text-left'
        } relative z-10`}
      >
        {/* Ghost Year (Color Corrected: White/30) */}
        {/* Mobile Year */}
        <span className="md:hidden font-sans text-xs text-white/40 mb-2 uppercase tracking-widest pl-1">
          {story.year} — Highlight
        </span>

        {/* Desktop Ghost Year */}
        <motion.span
          style={{ x: textX, y: textY }}
          className="hidden md:block font-serif text-[12rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/5 to-transparent select-none absolute -top-40 -z-10 transition-opacity duration-700 opacity-0 md:opacity-100 will-change-transform"
        >
          {story.year}
        </motion.span>

        {/* Title */}
        <h3 className="relative z-10 font-serif text-3xl md:text-6xl text-white mb-4 md:mb-6 mix-blend-difference group-hover:text-white/90 transition-colors">
          {story.names}
        </h3>

        {/* Location Pill (Color Corrected: White Border) */}
        <div className="relative z-10 flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 md:px-5 md:py-2 w-fit bg-[#0f0f11]/50 backdrop-blur-md md:group-hover:border-white/50 md:group-hover:text-white transition-colors">
          <MapPin
            size={14}
            className="text-white/70 md:group-hover:text-white transition-colors"
          />
          <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-white/80">
            {story.location}
          </span>
        </div>

        {/* Description */}
        <p className="relative z-10 mt-6 md:mt-8 font-sans text-white/60 md:text-white/50 text-sm max-w-xs leading-relaxed">
          {story.description}
        </p>

        {/* Decorative Line (Color Corrected: White) */}
        <div
          className={`mt-6 md:mt-8 h-[1px] w-12 bg-white/30 md:bg-white/20 origin-left transition-all duration-700 md:group-hover:w-48 md:group-hover:bg-white`}
        ></div>
      </div>
    </motion.article>
  );
});
