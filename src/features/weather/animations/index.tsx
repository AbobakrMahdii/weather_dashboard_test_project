/**
 * Weather Feature Animation Variants
 * Framer Motion animation configurations for weather components
 */

import { Variants } from "framer-motion";

/**
 * Card entrance animation with fade and slide
 */
export const cardEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Simple fade in from bottom
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/**
 * Slide in from right
 */
export const slideInFromRight: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Slide in from left
 */
export const slideInFromLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Stagger children animation
 */
export const staggerChildren: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Weather icon floating animation
 */
export const weatherIconFloat: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Temperature counting animation
 */
export const temperatureCount = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "backOut",
    },
  },
};

/**
 * Pulse animation for loading states
 */
export const pulse: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Rotate animation for refresh button
 */
export const rotate360: Variants = {
  initial: {
    rotate: 0,
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

/**
 * Scale bounce animation
 */
export const scaleBounce: Variants = {
  initial: {
    scale: 1,
  },
  tap: {
    scale: 0.95,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Shimmer loading animation
 */
export const shimmer = {
  initial: {
    backgroundPosition: "-1000px 0",
  },
  animate: {
    backgroundPosition: "1000px 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Dropdown menu animation
 */
export const dropdownMenu: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

/**
 * Alert banner animation
 */
export const alertBanner: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -50,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Background gradient animation
 */
export const backgroundGradient = {
  initial: {
    backgroundPosition: "0% 50%",
  },
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Weather condition transition
 */
export const weatherConditionTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.4,
    },
  },
};

/**
 * Number counter animation utility
 */
export const createCounterAnimation = (from: number, to: number) => ({
  from,
  to,
  transition: {
    duration: 1,
    ease: "easeOut",
  },
});
