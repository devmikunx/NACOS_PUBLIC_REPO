import type { NextConfig } from "next";

// Real backend origin — server-side only, used to forward proxied requests.
// Read from INTERNAL_API_URL (preferred, never exposed to browser) and fall
// back to NEXT_PUBLIC_API_URL for existing deployments.
const backendUrl =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api/v1";

// Strip /api/v1 suffix if present to get the bare origin.
const backendOrigin = backendUrl.replace(/\/api\/v\d+\/?$/, "");

const nextConfig: NextConfig = {
  // Proxy /api/v1/* → Express backend so browser requests are same-origin.
  // This lets cookies work in dev without HTTPS (sameSite:lax is sufficient
  // when both the page and the API are on the same origin).
  //
  // The public site has no basePath, so the browser requests /api/v1/...
  // directly and the rewrite source matches as-is.
  //
  // NEXT_PUBLIC_API_URL must be set to /api/v1 (relative) in .env.local so
  // the browser client builds same-origin URLs. INTERNAL_API_URL must be the
  // real backend URL (e.g. http://localhost:5000/api/v1) for Server Components
  // which bypass the proxy and talk to Express directly.
  async rewrites() {
    return [
      // Proxy API calls to the backend
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
      // Proxy /admin/* to the admin Next.js app (unchanged from original)
      {
        source: "/admin/:path*",
        destination: `${process.env.ADMIN_APP_URL}/admin/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mtjafpexqltvvunfudcr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  allowedDevOrigins: ["172.20.10.3"],
};

export default nextConfig;
