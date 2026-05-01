/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Compiler for better performance
  reactCompiler: true,
  
  // Sass configuration (no changes needed)
  sassOptions: {
    includePaths: ['./src/styles'],
    silenceDeprecations: ['import', 'legacy-js-api'],
  },
  
  // ✅ CRITICAL FIX: Turbopack root configuration for faster compilation
  turbopack: {
    root: process.cwd(), // Sets root to current working directory (frontend folder)
  },
  
  // Webpack fallback (for when not using Turbopack)
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
      config.snapshot = {
        managedPaths: [],
        immutablePaths: [],
      };
    }
    return config;
  },
  
  // Allowed dev origins for ngrok (no changes)
  allowedDevOrigins: [
    'metamerically-aerobiotic-lizbeth.ngrok-free.dev',
    '*.ngrok-free.dev',
  ],
  
  // Optional: Increase build performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optional: Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
    ],
  },
};

export default nextConfig;