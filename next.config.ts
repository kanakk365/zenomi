import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // Allow embedding GitHub Pages courses in iframes
            // frame-src controls which external sites we can embed
            // frame-ancestors controls who can embed our site (we allow same origin)
            value: "frame-src 'self' https://zenomihealth.github.io https://*.zenomihealth.github.io; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
