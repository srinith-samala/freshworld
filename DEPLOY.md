# Deploy on ONE host (Render) + free database (Neon)

The Express server now also serves the dashboard, so there is only one app to deploy.

## 1. Database (Neon - free Postgres, does not expire)
Create a project at neon.tech -> copy the connection string (DATABASE_URL).
(Render has its own Postgres too, but the free one is deleted after 30 days - don't keep real data there.)

## 2. App (Render)
- New -> Blueprint -> select this repo (uses render.yaml), or New -> Web Service with:
  - Build Command: `cd dashboard && npm install && npm run build && cd ../backend && npm install && npx prisma db push`
  - Start Command: `cd backend && npm start`
- Env vars: DATABASE_URL (Neon), JWT_SECRET (long random), FRONTEND_URL (your Render URL, no trailing slash), ADMIN_PASSWORD (optional)
- Do NOT set VITE_API_URL (the dashboard then talks to the same address).
- On first start the server creates admin@stock.com automatically (password = ADMIN_PASSWORD, or `admin123` if not set).
- Open your Render URL -> login.

## 3. After go-live
Change the admin password / create users from the Users page.
Open Recipe Costing and click "Load sample products".

## Notes
- Free Render services sleep after ~15 min idle; first request afterwards takes about a minute.

## Alternative: separate hosting (Netlify frontend + Render backend)
Set Netlify base directory `dashboard`, env var VITE_API_URL = backend URL, and FRONTEND_URL on the backend = Netlify URL.
