'use client';

import {
motion,
useMotionValue,
useScroll,
useSpring,
useTransform,
useVelocity,
Variants,
} from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

// --- DYNAMIC IMPORTS ---
const HorizontalScroll = dynamic(
() => import('@/components/horizontal-scroll'),
{ loading: () => <div className="h-screen bg-[#0f0f11]" /> }
);
const Philosophy = dynamic(() => import('@/components/philosophy'));
const LoveStories = dynamic(() => import('@/components/love-stories'));
const Footer = dynamic(() => import('@/components/footer'));

// --- ANIMATION VARIANTS ---
const revealImage: Variants = {
hidden: { scale: 1.2, opacity: 0 },
visible: {
scale: 1,
opacity: 1,
transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
},
};

const revealText: Variants = {
hidden: { y: 100, opacity: 0 },
visible: (i: number) => ({
y: 0,
opacity: 1,
transition: {
duration: 1.2,
delay: 0.3 + i \* 0.1,
ease: [0.16, 1, 0.3, 1],
},
}),
};

export default function Home() {
const containerRef = useRef<HTMLDivElement>(null);
const heroRef = useRef<HTMLElement>(null);
const [isMounted, setIsMounted] = useState(false);

// --- SCROLL PHYSICS ENGINE ---
const { scrollY } = useScroll();
const { scrollYProgress } = useScroll({
target: containerRef,
offset: ['start start', 'end start'],
});

// 1. VELOCITY SKEW (Matching Horizontal Scroll)
const scrollVelocity = useVelocity(scrollY);
const smoothVelocity = useSpring(scrollVelocity, {
damping: 50,
stiffness: 400,
});
const skewX = useTransform(smoothVelocity, [-2000, 2000], [-5, 5]); // Subtle skew on scroll

// 2. PARALLAX
const yImg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
const yTextTop = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
const yTextBottom = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

// 3. MOUSE PHYSICS (Desktop Tilt)
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
if (typeof window !== 'undefined' && window.innerWidth < 768) return;
const { clientX, clientY, currentTarget } = e;
const { width, height, left, top } = currentTarget.getBoundingClientRect();
mouseX.set((clientX - left) / width - 0.5);
mouseY.set((clientY - top) / height - 0.5);
};

const springConfig = { stiffness: 40, damping: 30, mass: 1 };
const rotateX = useSpring(
useTransform(mouseY, [-0.5, 0.5], [4, -4]),
springConfig
);
const rotateY = useSpring(
useTransform(mouseX, [-0.5, 0.5], [-4, 4]),
springConfig
);

useEffect(() => setIsMounted(true), []);

return (
<main className="relative w-full bg-[#0f0f11] selection:bg-white selection:text-black">
{/_ 1. CINEMATIC HERO _/}
<section
ref={heroRef}
onMouseMove={handleMouseMove}
className="relative h-screen w-full overflow-hidden flex flex-col justify-between py-12 md:py-24 perspective-1000"
style={{ perspective: '2000px' }} >
{/_ --- LAYER 0: GLOBAL GRAIN --- _/}
<div className="absolute inset-0 z-[1] opacity-[0.06] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay will-change-transform"></div>

        {/* --- LAYER 1: THE VELOCITY IMAGE (Centerpiece) --- */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <motion.div
            variants={revealImage}
            initial="hidden"
            animate="visible"
            style={{
              skewX, // Reacts to scroll velocity!
              scale: scaleImg,
              y: yImg,
              rotateX, // Reacts to mouse!
              rotateY,
              opacity: opacityHero,
            }}
            // Match the aspect ratio and styling of your Gallery Cards
            className="relative w-[85vw] h-[50vh] md:w-[35vw] md:h-[65vh] will-change-transform origin-center"
          >
            {/* The "Card" Container */}
            <div className="relative w-full h-full overflow-hidden rounded-sm bg-[#1a1a1a] border border-white/5 shadow-2xl shadow-black/50">
              <Image
                src="https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=2070&auto=format&fit=crop"
                alt="Cinematic Wedding"
                fill
                // Matches Gallery: Grayscale on Desktop (Hover to see color implied), Color on Mobile
                className="object-cover opacity-80 md:opacity-60 grayscale-0 md:grayscale transition-all duration-1000"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Inner Grain & Shine (Consistency) */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-30 pointer-events-none"></div>
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0f0f11]/10 to-[#0f0f11]/80 mix-blend-multiply"></div>
            </div>
          </motion.div>
        </div>

        {/* --- LAYER 2: THE TYPOGRAPHY (Parallax Frame) --- */}
        <motion.div className="relative z-10 w-full h-full flex flex-col justify-between px-6 md:px-16 pointer-events-none">
          {/* TOP: SAMUDIKA */}
          <motion.div style={{ y: yTextTop, opacity: opacityHero }}>
            <div className="flex justify-between items-start border-t border-white/10 pt-6 mb-4 mix-blend-difference">
              <motion.span
                variants={revealText}
                custom={0}
                initial="hidden"
                animate="visible"
                className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/50"
              >
                Est. 2018
              </motion.span>
              <motion.span
                variants={revealText}
                custom={0}
                initial="hidden"
                animate="visible"
                className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/50 text-right hidden md:block"
              >
                Sri Lanka
              </motion.span>
            </div>

            <div className="overflow-hidden">
              <motion.div
                variants={revealText}
                custom={1}
                initial="hidden"
                animate="visible"
              >
                {/* Same font styles as Horizontal Scroll Background Text */}
                <h1 className="font-serif text-[13vw] leading-[0.8] tracking-tighter text-center md:text-left text-white mix-blend-difference drop-shadow-2xl">
                  SAMUDIKA
                </h1>
              </motion.div>
            </div>
          </motion.div>

          {/* CENTER: Floating Badge */}
          {/* This acts like the "Introductory Card" text in your gallery */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto mix-blend-difference">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 1.5, ease: 'easeOut' }}
              style={{ opacity: opacityHero }}
              className="border border-white/20 rounded-full px-6 py-2 md:px-8 md:py-3 bg-white/5 backdrop-blur-md"
            >
              <p className="font-sans text-[9px] md:text-xs font-bold uppercase tracking-[0.35em] text-white/90">
                Fine Art Photography
              </p>
            </motion.div>
          </div>

          {/* BOTTOM: CHATHURANGA */}
          <motion.div style={{ y: yTextBottom, opacity: opacityHero }}>
            <div className="overflow-hidden">
              <motion.div
                variants={revealText}
                custom={2}
                initial="hidden"
                animate="visible"
              >
                <h1 className="font-serif text-[13vw] leading-[0.8] tracking-tighter mb-4 text-center md:text-right text-white mix-blend-difference drop-shadow-2xl">
                  CHATHURANGA
                </h1>
              </motion.div>
            </div>

            <div className="flex justify-center md:justify-between items-end border-b border-white/10 pb-6 mix-blend-difference">
              <motion.div
                variants={revealText}
                custom={3}
                initial="hidden"
                animate="visible"
                className="hidden md:flex gap-12 pointer-events-auto"
              >
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-pointer">
                  Instagram
                </span>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-pointer">
                  Facebook
                </span>
              </motion.div>

              <motion.div
                variants={revealText}
                custom={3}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center gap-2"
              >
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/30">
                  Scroll
                </span>
                <div className="w-[1px] h-12 bg-white/30 animate-pulse"></div>
              </motion.div>
            </div>
          </motion.div>
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

/////////////////////////////

('use client');

import { useMotionTemplate } from 'framer-motion';

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
left: Math.random() _ 100,
top: 80 + Math.random() _ 20,
}));
setParticles(generatedParticles);
}, []);

return (
<main className="relative w-full bg-[#0f0f11]">
{/_ 1. CINEMATIC HERO SECTION _/}
<section
ref={heroRef}
onMouseMove={handleMouseMove}
className="relative h-screen w-full overflow-hidden flex flex-col justify-between py-12 md:py-24 perspective-1000"
style={{ perspective: '1200px' }} >
{/_ --- LAYER 0: GLOBAL ATMOSPHERE --- _/}
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

          <h1 className="font-serif text-[13vw] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 tracking-tighter mt-4 text-center md:text-left drop-shadow-2xl">
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
          <h1 className="font-serif text-[13vw] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-t from-white via-white/80 to-white/20 tracking-tighter mb-4 text-center md:text-right drop-shadow-2xl">
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

//////////////////////////////////

'use client';

import {
AnimatePresence,
motion,
useMotionTemplate,
useMotionValue,
useMotionValueEvent,
useScroll,
useSpring,
useTransform,
} from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowRight, Camera } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState, type MouseEvent } from 'react';

// --- TYPES ---
interface NavLink {
name: string;
target: string;
}

interface MobileMenuProps {
links: NavLink[];
onNavigate: (target: string) => void;
close: () => void;
}

// --- CONSTANTS ---
const NAV_LINKS: NavLink[] = [
{ name: 'Portfolio', target: '#portfolio' },
{ name: 'About', target: '#about' },
{ name: 'Stories', target: '#stories' },
];

const springConfig = { stiffness: 100, damping: 15, mass: 0.5 };

// --- ANIMATION VARIANTS ---
const navbarVariants = {
visible: {
y: 0,
opacity: 1,
scale: 1,
transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
},
hidden: {
y: '-150%',
opacity: 0,
scale: 0.95,
transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
},
};

export default function Navbar() {
const [isOpen, setIsOpen] = useState(false);
const [isHidden, setIsHidden] = useState(false);

const pathname = usePathname();
const router = useRouter();
const { scrollY } = useScroll();
const lenis = useLenis();

// Mouse Physics for the Island Tilt
const ref = useRef<HTMLDivElement>(null);
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const rotateX = useSpring(
useTransform(mouseY, [-0.5, 0.5], [15, -15]),
springConfig
);
const rotateY = useSpring(
useTransform(mouseX, [-0.5, 0.5], [-15, 15]),
springConfig
);

// Spotlight Gradient
const spotlightX = useSpring(0, { stiffness: 150, damping: 20 });
const spotlightY = useSpring(0, { stiffness: 150, damping: 20 });

// 1. ROUTE GUARD
if (pathname === '/stories') return null;

// 2. SCROLL LOGIC
useMotionValueEvent(scrollY, 'change', (latest) => {
const previous = scrollY.getPrevious() ?? 0;
if (latest > previous && latest > 150 && !isOpen) {
setIsHidden(true);
} else {
setIsHidden(false);
}
});

// 3. EVENT HANDLERS
const handleNavigation = (target: string) => {
setIsOpen(false);
if (pathname === '/') {
target === 'top' ? lenis?.scrollTo(0) : lenis?.scrollTo(target);
} else {
router.push(`/${target === 'top' ? '' : target}`);
}
};

const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
if (!ref.current) return;
const rect = ref.current.getBoundingClientRect();

    // Tilt Calculation
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);

    // Spotlight Calculation
    spotlightX.set(mouseXPos);
    spotlightY.set(mouseYPos);

};

const handleMouseLeave = () => {
mouseX.set(0);
mouseY.set(0);
rotateX.set(0);
rotateY.set(0);
};

// Dynamic Spotlight Style
const spotlightStyle = useMotionTemplate`radial-gradient(150px circle at ${spotlightX}px ${spotlightY}px, rgba(255,255,255,0.15), transparent 80%)`;

return (
<>
<motion.header
variants={navbarVariants}
initial="visible"
animate={isHidden ? 'hidden' : 'visible'}
className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none perspective-1000"
style={{ perspective: '1000px' }} >
{/_ THE LIVING ISLAND _/}
<motion.nav
ref={ref}
onMouseMove={handleMouseMove}
onMouseLeave={handleMouseLeave}
style={{ rotateX, rotateY }}
className="pointer-events-auto relative flex items-center gap-2 rounded-full p-2 px-3 shadow-2xl overflow-hidden will-change-transform transform-3d" >
{/_ A. LIQUID GLASS LAYERS _/}
<div className="absolute inset-0 bg-[#0f0f11]/55 backdrop-blur-2xl backdrop-saturate-200 z-0"></div>

          {/* Spotlight Layer */}
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay"
            style={{ background: spotlightStyle }}
          />

          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 pointer-events-none mix-blend-overlay"></div>

          {/* Shimmer Borders */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-0 opacity-50"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/80 to-transparent z-0"></div>
          <div className="absolute inset-0 rounded-full ring-1 ring-white/10 z-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"></div>

          {/* B. CONTENT */}
          <div className="relative z-10 flex items-center gap-1">
            {/* Logo */}
            <MagneticIcon onClick={() => handleNavigation('top')}>
              <Camera size={18} className="text-white" />
            </MagneticIcon>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1 px-1">
              {NAV_LINKS.map((link) => (
                <MagneticButton
                  key={link.name}
                  onClick={() => handleNavigation(link.target)}
                >
                  {link.name}
                </MagneticButton>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleNavigation('#contact')}
              className="focus-ring hidden md:block ml-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Book Now
            </button>

            {/* Mobile Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus-ring flex h-10 w-10 md:hidden items-center justify-center rounded-full text-white hover:bg-white/10 z-50 relative"
              aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
            >
              <div className="flex flex-col gap-[5px]">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  className="w-5 h-[1.5px] bg-white block origin-center transition-all duration-300"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-5 h-[1.5px] bg-white block transition-all duration-300"
                />
                <motion.span
                  animate={
                    isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
                  }
                  className="w-5 h-[1.5px] bg-white block origin-center transition-all duration-300"
                />
              </div>
            </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* C. MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            links={NAV_LINKS}
            onNavigate={handleNavigation}
            close={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>

);
}

// --- SUB-COMPONENTS ---

function MagneticButton({
children,
onClick,
}: {
children: string;
onClick: () => void;
}) {
const ref = useRef<HTMLButtonElement>(null);
const x = useMotionValue(0);
const y = useMotionValue(0);

const xSpring = useSpring(x, springConfig);
const ySpring = useSpring(y, springConfig);

const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
const { clientX, clientY } = e;
const { height, width, left, top } = ref.current!.getBoundingClientRect();
x.set(clientX - (left + width / 2));
y.set(clientY - (top + height / 2));
};

const handleMouseLeave = () => {
x.set(0);
y.set(0);
};

return (
<motion.button
ref={ref}
onClick={onClick}
onMouseMove={handleMouseMove}
onMouseLeave={handleMouseLeave}
style={{ x: xSpring, y: ySpring }}
className="focus-ring relative px-5 py-3 text-sm font-medium text-white/60 hover:text-white transition-colors group rounded-full" >
<span className="relative z-10">{children}</span>
<span className="absolute inset-0 rounded-full bg-white/5 opacity-0 scale-50 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 backdrop-blur-md"></span>
</motion.button>
);
}

function MagneticIcon({
children,
onClick,
}: {
children: React.ReactNode;
onClick: () => void;
}) {
const ref = useRef<HTMLButtonElement>(null);
const x = useMotionValue(0);
const y = useMotionValue(0);
const xSpring = useSpring(x, springConfig);
const ySpring = useSpring(y, springConfig);

const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
const { clientX, clientY } = e;
const { height, width, left, top } = ref.current!.getBoundingClientRect();
x.set(clientX - (left + width / 2));
y.set(clientY - (top + height / 2));
};

return (
<motion.button
ref={ref}
onClick={onClick}
onMouseMove={handleMouseMove}
onMouseLeave={() => {
x.set(0);
y.set(0);
}}
style={{ x: xSpring, y: ySpring }}
className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors" >
{children}
</motion.button>
);
}

// --- SUB-COMPONENT: MOBILE MENU (GOD TIER) ---
function MobileMenu({ links, onNavigate }: MobileMenuProps) {
const menuVariants = {
initial: { clipPath: 'circle(0% at 90% 5%)' }, // Opens from the burger button
animate: {
clipPath: 'circle(150% at 90% 5%)',
transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
},
exit: {
clipPath: 'circle(0% at 90% 5%)',
transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
},
};

const containerVars = {
initial: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
animate: { transition: { delayChildren: 0.2, staggerChildren: 0.1 } },
};

const linkVars = {
initial: { y: 50, opacity: 0 },
animate: {
y: 0,
opacity: 1,
transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
},
};

return (
<motion.div
variants={menuVariants}
initial="initial"
animate="animate"
exit="exit"
className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-between px-6 pt-32 pb-12 overflow-hidden" >
{/_ 1. ATMOSPHERE _/}
<div className="absolute inset-0 bg-[#0f0f11]/80 backdrop-blur-3xl backdrop-saturate-150 z-0"></div>
<div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      {/* 2. MENU CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Top Section */}
        <motion.div
          variants={containerVars}
          initial="initial"
          animate="animate"
          exit="initial"
          className="flex flex-col gap-6"
        >
          <div className="h-[1px] w-full bg-white/10 mb-4"></div>
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-white/40 mb-2 pl-1">
            Menu
          </span>

          {links.map((link, i) => (
            <motion.div
              key={link.name}
              variants={linkVars}
              className="overflow-hidden group"
            >
              <button
                onClick={() => onNavigate(link.target)}
                className="w-full text-left flex items-baseline gap-4"
              >
                <span className="font-sans text-sm text-white/30 group-hover:text-white/60 transition-colors">
                  0{i + 1}
                </span>
                <span className="font-serif text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white/60 via-white to-white/60 bg-[length:200%_auto] animate-shimmer">
                  {link.name}
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          <div className="flex justify-between items-end border-t border-white/10 pt-8">
            <div className="flex flex-col gap-2">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/40">
                Connect
              </span>
              <div className="flex gap-6 text-sm text-white/60">
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('#contact')}
            className="group w-full flex items-center justify-between rounded-full border border-white/20 px-8 py-6 text-lg uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all duration-500 bg-white/5 backdrop-blur-md"
          >
            <span>Start Project</span>
            <ArrowRight
              size={24}
              className="group-hover:-rotate-45 transition-transform duration-500"
            />
          </button>
        </motion.div>
      </div>
    </motion.div>

);
}
