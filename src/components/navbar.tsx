'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useLenis } from 'lenis/react';
import { Camera, Menu, X } from 'lucide-react';
import { useState } from 'react';

// --- TYPES & DATA ---
interface NavLink {
  name: string;
  target: string;
}

const NAV_LINKS: NavLink[] = [
  { name: 'Portfolio', target: '#portfolio' },
  { name: 'About', target: '#about' },
  { name: 'Stories', target: '#stories' },
  { name: 'Contact', target: '#contact' },
];

// --- ANIMATION VARIANTS ---
const navbarVariants = {
  visible: { y: 0, opacity: 1 },
  hidden: { y: '-150%', opacity: 0 },
};

const mobileMenuVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { scrollY } = useScroll();
  const lenis = useLenis();

  // 1. FEATURE: Smart Scroll Logic
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const handleScroll = (target: string) => {
    setIsOpen(false);
    if (lenis) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  return (
    <>
      <motion.div
        variants={navbarVariants}
        initial="visible"
        animate={isHidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 px-4 shadow-2xl backdrop-blur-xl ring-1 ring-black/5">
          {/* Logo - Scrolls to Top */}
          <button
            onClick={() => handleScroll('top')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            aria-label="Scroll to top"
          >
            <Camera size={18} className="text-white" />
          </button>

          {/* Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 px-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => handleScroll(link.target)}
                className="relative px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white group"
              >
                {link.name}
                {/* Hover Underline Animation */}
                <span className="absolute inset-x-2 bottom-2 h-px scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100 opacity-50"></span>
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => handleScroll('#contact')}
            className="hidden md:block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            Book Now
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 md:hidden items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && <MobileMenu links={NAV_LINKS} onNavigate={handleScroll} />}
      </AnimatePresence>
    </>
  );
}

// --- SUB-COMPONENT: MOBILE MENU ---
function MobileMenu({
  links,
  onNavigate,
}: {
  links: NavLink[];
  onNavigate: (target: string) => void;
}) {
  return (
    <motion.div
      variants={mobileMenuVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0f0f11]/95 backdrop-blur-3xl md:hidden"
    >
      <div className="flex flex-col items-center gap-8">
        {links.map((link) => (
          <button
            key={link.name}
            onClick={() => onNavigate(link.target)}
            className="text-3xl font-sans text-white hover:text-orange-200 transition-colors"
          >
            {link.name}
          </button>
        ))}
        <button
          onClick={() => onNavigate('#contact')}
          className="mt-8 rounded-full bg-white px-8 py-4 text-lg font-semibold text-black"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  );
}
