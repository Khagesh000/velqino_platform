'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LogoLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
    >
      {/* Animated Background Circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-20" />
      </motion.div>

      {/* Main Logo Container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className="relative z-10 text-center"
      >
        {/* Logo Icon */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
        >
          <span className="text-primary-600">
            Velqino
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm sm:text-base text-gray-500 mt-2 font-medium"
        >
          Your Trusted Platform
        </motion.p>

        {/* Animated Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-48 h-0.5 bg-gray-200 rounded-full overflow-hidden mx-auto mt-6"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ 
              duration: 1.5,
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
          transition={{ delay: 0.8 }}
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