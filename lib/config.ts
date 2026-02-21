export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "defragancias.com";
