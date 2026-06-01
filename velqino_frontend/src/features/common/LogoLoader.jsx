'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LogoLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
    >
      {/* Main Logo Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="relative z-10 text-center px-4"
      >
        {/* Logo Box */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <motion.svg
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-12 h-12 sm:w-14 sm:h-14 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </motion.svg>
        </div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold"
        >
          <span className="text-primary-600">Velqino</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-sm sm:text-base text-gray-500 font-medium mt-2"
        >
          Your Trusted Business Platform
        </motion.p>

        {/* Loading Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto mt-6"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-full h-full bg-primary-500 rounded-full"
          />
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-4"
        >
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: dot * 0.15,
                ease: "easeInOut"
              }}
              className="w-2 h-2 rounded-full bg-primary-500"
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LogoLoader;