'use client';

import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

// --- TYPES ---
interface GalleryItem {
  id: number;
  url: string;
  title: string;
  desc: string;
  year: string;
}

// --- DATA ---
const ITEMS: GalleryItem[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop',
    title: 'The Vows',
    desc: 'Lake Como',
    year: '2024',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop',
    title: 'First Look',
    desc: 'Tuscany',
    year: '2024',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
    title: 'Golden Hour',
    desc: 'Kyoto',
    year: '2023',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2070&auto=format&fit=crop',
    title: 'The Party',
    desc: 'New York',
    year: '2023',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop',
    title: 'Details',
    desc: 'Paris',
    year: '2022',
  },
];

export default function HorizontalScroll() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // 1. SCROLL PHYSICS
  // Desktop: -95% (Show all) | Mobile: -85% (Cards are wider, need less travel)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-90%']);

  // 2. VELOCITY PHYSICS
  const scrollVelocity = useVelocity(scrollYProgress);
  const skewVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30,
  });

  // Skew is aggressive on Desktop (30), subtle on Mobile (10)
  const skewX = useTransform(skewVelocity, [-1, 1], [30, -30]); // Framer handles the resizing interpolation automatically
  const scale = useTransform(skewVelocity, [-1, 1], [0.95, 0.95]);
  const dynamicScale = useTransform(scale, (s) => (s < 1 ? s : 1));

  // 3. Background Parallax Text
  const textX1 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const textX2 = useTransform(scrollYProgress, [0, 1], ['-30%', '0%']);

  return (
    <section ref={targetRef} className="relative h-[500vh] bg-[#0f0f11]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* --- LAYER 0: BACKGROUND TYPOGRAPHY (Responsive Text Size) --- */}
        <div className="absolute inset-0 flex flex-col justify-center gap-2 md:gap-4 z-0 opacity-10 pointer-events-none select-none mix-blend-color-dodge">
          <motion.div style={{ x: textX1 }} className="whitespace-nowrap">
            <h1 className="font-serif text-[25vw] md:text-[18vw] leading-[0.8] text-white tracking-tighter">
              TIMELESS MEMORIES — TIMELESS MEMORIES —
            </h1>
          </motion.div>
          <motion.div
            style={{ x: textX2 }}
            className="whitespace-nowrap ml-[-20vw]"
          >
            <h1 className="font-serif italic text-[25vw] md:text-[18vw] leading-[0.8] text-white tracking-tighter">
              CAPTURING SOULS — CAPTURING SOULS —
            </h1>
          </motion.div>
        </div>

        {/* --- LAYER 1: PROGRESS BAR --- */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-20">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-full bg-white origin-left will-change-transform"
          ></motion.div>
        </div>

        {/* --- LAYER 2: THE GALLERY TRACK --- */}
        <motion.div
          style={{ x }}
          className="relative z-10 flex gap-8 md:gap-12 pl-6 md:pl-[10vw] items-center will-change-transform"
        >
          {/* Introductory Card (Responsive Size) */}
          <div className="flex h-[50vh] w-[80vw] md:h-[60vh] md:w-[30vw] min-w-[300px] md:min-w-[350px] flex-col justify-center z-10 shrink-0 border-l border-white/10 pl-8 md:pl-12 backdrop-blur-sm">
            <h2 className="font-serif text-5xl md:text-8xl leading-[0.9] text-white mb-6 md:mb-8">
              The <br /> <span className="text-white/40 italic">Gallery.</span>
            </h2>
            <p className="text-sm text-white/50 max-w-xs font-sans tracking-wide leading-relaxed">
              Drag the scrollbar. Feel the weight of the memories.
              <br />
              <br />
              <span className="text-white text-xs uppercase tracking-[0.2em]">
                01 — 05
              </span>
            </p>
          </div>

          {/* SKEWING IMAGES */}
          {ITEMS.map((item, i) => (
            <VelocityCard
              key={item.id}
              item={item}
              index={i}
              skew={skewX}
              scale={dynamicScale}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- SUB-COMPONENT: VELOCITY CARD ---
interface VelocityCardProps {
  item: GalleryItem;
  index: number;
  skew: MotionValue<number>;
  scale: MotionValue<number>;
}

function VelocityCard({ item, index, skew, scale }: VelocityCardProps) {
  // Parallax for the Title
  const titleX = useTransform(skew, [30, -30], [-40, 40]);

  return (
    <motion.div
      style={{ skewX: skew, scale: scale }}
      // MOBILE: w-[85vw] (Takes up most of the phone screen)
      // DESKTOP: w-[45vh] (Takes up vertical slice)
      className="group relative h-[50vh] w-[85vw] md:h-[65vh] md:w-[45vh] md:min-w-[400px] shrink-0 cursor-pointer perspective-1000 will-change-transform"
    >
      {/* 1. Image Container */}
      <div className="relative h-full w-full overflow-hidden rounded-sm bg-[#1a1a1a] border border-white/5 transition-all duration-700 group-hover:border-white/20">
        <Image
          src={item.url}
          alt={item.title}
          fill
          // Mobile: Bright opacity (0.8). Desktop: Darker (0.6) until hover.
          className="object-cover opacity-80 md:opacity-60 md:grayscale transition-all duration-700 md:group-hover:scale-110 md:group-hover:opacity-100 md:group-hover:grayscale-0 will-change-transform"
          sizes="(max-width: 768px) 85vw, 50vw"
          quality={80}
          priority={index < 2}
        />

        {/* Grain */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>

      {/* 2. Floating Meta Data (Responsive Position) */}
      <div className="absolute -bottom-12 md:-bottom-16 left-0 flex items-center gap-4">
        <span className="font-serif text-3xl md:text-4xl text-white/40 md:text-white/20 group-hover:text-white transition-colors duration-500 delay-100">
          0{item.id}
        </span>
        <div className="h-[1px] w-8 md:w-12 bg-white/10 group-hover:bg-white/50 transition-colors duration-500"></div>
        <div>
          <p className="font-serif text-[10px] md:text-xs text-white/50 italic mb-1 md:group-hover:text-white/60 transition-colors">
            {item.desc}
          </p>
          <motion.h3
            style={{ x: titleX }}
            className="font-sans text-xs md:text-sm uppercase tracking-[0.2em] text-white font-bold"
          >
            {item.title}
          </motion.h3>
        </div>
      </div>

      {/* 3. Year Stamp */}
      <div className="absolute -top-8 md:-top-12 right-0 overflow-hidden">
        <span className="block font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/30 md:text-white/20 md:group-hover:text-white/60 transition-colors md:translate-y-full md:group-hover:translate-y-0 duration-500 delay-75">
          {item.year}
        </span>
      </div>
    </motion.div>
  );
}
