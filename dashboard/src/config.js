// Backend URL.
// - Separate hosting (e.g. Netlify + Render): set VITE_API_URL to the backend URL (no trailing slash).
// - Single-host deploy (backend serves the dashboard): leave VITE_API_URL unset in production -> same origin.
// - Local dev: falls back to http://localhost:5000.
const fromEnv = import.meta.env.VITE_API_URL;
export const API = (fromEnv ?? (import.meta.env.PROD ? '' : 'http://localhost:5000')).replace(/\/$/, '');
