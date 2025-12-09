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
        style={{ perspective: '1000px' }}
      >
        {/* THE LIVING ISLAND */}
        <motion.nav
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="pointer-events-auto relative flex items-center gap-2 rounded-full p-2 px-3 shadow-2xl overflow-hidden will-change-transform transform-3d"
        >
          {/* A. LIQUID GLASS LAYERS */}
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
      className="focus-ring relative px-5 py-3 text-sm font-medium text-white/60 hover:text-white transition-colors group rounded-full"
    >
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
      className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors"
    >
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
      className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-between px-6 pt-32 pb-12 overflow-hidden"
    >
      {/* 1. ATMOSPHERE */}
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
