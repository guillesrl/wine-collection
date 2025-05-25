/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: 'export',
  
  // Base path if your app is not served from the root
  // basePath: '/wine-collection', // Uncomment and set this if your app is not at the root
  
  // Disable image optimization since we're doing static export
  images: {
    unoptimized: true,
  },
  
  // Ensure trailing slashes for better compatibility with static hosting
  trailingSlash: true,
  
  // Disable source maps in production for smaller build size
  productionBrowserSourceMaps: false,
  
  // Disable React Strict Mode for static export
  reactStrictMode: false,
  
  // Skip type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Environment variables for static export
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  },
  
  // Disable the default static export optimization
  experimental: {
    // Enable if you're using the Pages Router
    // outputStandalone: true,
  },
};

// Only log environment variable warnings in development
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables are not set. Some features may not work correctly.');
  }
}

module.exports = nextConfig;
