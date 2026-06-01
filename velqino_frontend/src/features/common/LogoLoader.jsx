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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-primary-50 to-secondary-50"
    >
      {/* Animated Gradient Orbs */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{ 
            x: ["0%", "100%", "0%"],
            y: ["0%", "50%", "0%"]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{ 
            x: ["0%", "-100%", "0%"],
            y: ["0%", "-50%", "0%"]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-400 rounded-full blur-3xl opacity-15"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-primary-200/10 to-secondary-200/10 rounded-full blur-2xl"
        />
      </motion.div>

      {/* Main Logo Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="relative z-10 text-center px-4"
      >
        {/* Animated Logo Circle */}
        <motion.div
          animate={{ 
            rotate: 360,
            boxShadow: [
              "0 0 0 0 rgba(37, 99, 235, 0.1)",
              "0 0 0 20px rgba(37, 99, 235, 0)",
              "0 0 0 0 rgba(37, 99, 235, 0)"
            ]
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeOut" }
          }}
          className="mb-6 relative"
        >
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-primary-200/50"
          />
          
          {/* Logo Box */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl">
            {/* Animated Inner Glow */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl"
            />
            
            {/* Shopping Bag Icon */}
            <motion.svg
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </motion.svg>
            
            {/* Small Decorative Dot */}
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
            />
          </div>
        </motion.div>

        {/* Brand Name with Gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight"
        >
          <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Velqino
          </span>
        </motion.h1>

        {/* Tagline with Typewriter Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 overflow-hidden"
        >
          <motion.p
            animate={{ 
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm sm:text-base text-gray-500 font-medium"
          >
            Your Trusted Business Platform
          </motion.p>
        </motion.div>

        {/* Animated Progress Bar with Pulse */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 220, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="w-44 sm:w-52 h-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden mx-auto mt-6"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity,
              ease: "cubic-bezier(0.4, 0, 0.2, 1)"
            }}
            className="w-full h-full bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 rounded-full"
          />
        </motion.div>

        {/* Loading Dots with Bounce Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2.5 mt-5"
        >
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              animate={{ 
                y: [0, -12, 0],
                scale: [1, 1.2, 1],
                backgroundColor: ["#3B82F6", "#6366F1", "#3B82F6"]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: dot * 0.15,
                ease: "easeInOut"
              }}
              className="w-2.5 h-2.5 rounded-full bg-primary-500"
            />
          ))}
        </motion.div>

        {/* Loading Percentage Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-xs text-gray-400 mt-4 font-mono"
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading amazing experience...
          </motion.span>
        </motion.p>
      </motion.div>

      {/* Bottom Gradient Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
      />
    </motion.div>
  );
};

export default LogoLoader;