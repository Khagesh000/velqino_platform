/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  sassOptions: {
    includePaths: ['./src/styles'],
    silenceDeprecations: ['import', 'legacy-js-api'],
  },
  turbopack: {},
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Force webpack to watch the entire src folder
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
      
      // This is the KEY fix - watch features folder
      config.snapshot = {
        managedPaths: [],
        immutablePaths: [],
      };
    }
    return config;
  },
  // ADD THIS FOR NGORK HOT RELOAD
  allowedDevOrigins: [
    'metamerically-aerobiotic-lizbeth.ngrok-free.dev',
    '*.ngrok-free.dev'
  ],
};
export default nextConfig;