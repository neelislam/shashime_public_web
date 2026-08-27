"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: {
          opacity: 0,
          y: 24,
          scale: 0.985,
          filter: "blur(10px)",
        },

        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],

            // Children animate after the page begins
            staggerChildren: 0.06,
            delayChildren: 0.05,
          },
        },

        exit: {
          opacity: 0,
          y: -16,
          scale: 0.99,
          filter: "blur(8px)",
          transition: {
            duration: 0.35,
            ease: [0.4, 0, 1, 1],
          },
        },
      }}
    >
      {children}
    </motion.main>
  );
}
