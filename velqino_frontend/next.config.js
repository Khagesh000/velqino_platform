/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    // This silences the deprecation warnings
    silenceDeprecations: ['import', 'legacy-js-api'],
  },
};

module.exports = nextConfig;