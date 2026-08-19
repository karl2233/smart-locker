// Placeholder for `npm run dev` and for Vitest.
//
// In a container this file is overwritten at start-up by
// docker-entrypoint.sh. Leaving API_BASE_URL out here means the app falls
// back to VITE_API_BASE_URL from your .env.development, so local development
// is unchanged.
window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};
