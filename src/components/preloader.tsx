'use client';

import { BezierDefinition, motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

const PRELOADER_COLOR = '#141414';
const ANIMATION_DURATION = 0.7;
const EASE_FLUID: BezierDefinition = [0.76, 0, 0.24, 1];

interface Dimension {
  width: number;
  height: number;
}

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState<Dimension>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const resize = () =>
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (index === 100) return;
    const timeout = setTimeout(() => setIndex((prev) => prev + 1), 10);
    return () => clearTimeout(timeout);
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  } L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} 0 Q${
    dimension.width / 2
  } 0 0 0 L0 0`;

  const curveVariants: Variants = {
    initial: {
      d: initialPath,
      transition: { duration: ANIMATION_DURATION, ease: EASE_FLUID },
    },
    exit: {
      d: targetPath,
      transition: {
        duration: ANIMATION_DURATION,
        ease: EASE_FLUID,
        delay: 0.3,
      },
    },
  };

  if (dimension.height === 0) return null;

  return (
    <motion.div
      variants={slideUpVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[99] flex items-center justify-center cursor-wait"
      style={{ backgroundColor: PRELOADER_COLOR }}
    >
      <motion.p
        variants={textVariants}
        initial="initial"
        animate="enter"
        className="flex items-center text-white text-5xl md:text-9xl font-serif z-10"
      >
        <span>{index}%</span>
      </motion.p>
      <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none">
        <motion.path
          variants={curveVariants}
          initial="initial"
          exit="exit"
          fill={PRELOADER_COLOR}
        ></motion.path>
      </svg>
    </motion.div>
  );
}

const slideUpVariants: Variants = {
  initial: { top: 0 },
  exit: {
    top: '-100vh',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
};
const textVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
};
