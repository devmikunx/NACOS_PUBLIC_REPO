// API_URL is used by browser-side code (apiClient).
// Must be a relative path (/api/v1) so requests go through the Next.js
// rewrite proxy on the same origin — avoids cross-origin cookie issues
// and works without HTTPS in dev.
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

export const API_URL = apiUrl;

// INTERNAL_API_URL is used exclusively by server-side code (publicServerFetch,
// Server Components). These run inside the Next.js Node process and can reach
// the backend directly without going through the browser proxy.
// Set INTERNAL_API_URL in .env.local (no NEXT_PUBLIC_ prefix — never exposed
// to the browser). Falls back to NEXT_PUBLIC_API_URL so existing deployments
// without the new var don't break.
export const INTERNAL_API_URL =
  process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";