# Fleet AI — Fleet Tracking & Route Analysis

This repository contains the Fleet AI project — a React + Vite frontend (with OpenLayers and Google Maps components) and a small `vehicle-routing-backend` for routing services. The app visualizes fleet vehicles, fetches routing geometry from OpenRouteService (ORS), and provides tools for route analysis and simulation.

IMPORTANT: This project may contain a development ORS API key. Do NOT commit production secrets. Move real keys to `.env` files or your CI secret store.

## Features

- Interactive map views (OpenLayers) with city pins and active routes
- Per-vehicle route selection and ORS-backed route geometry
- Dashboard components for fleet statistics
- Simple backend stub in `vehicle-routing-backend` for local development

## Quick start (development)

1. Install dependencies

```powershell
cd 'd:\HACKATHONS\AI_Fleet_Track_-main'
npm install
```

2. Run the frontend (Vite)

```powershell
npm run dev
```

3. (Optional) Run the backend

```powershell
cd vehicle-routing-backend
npm install
npm start
```

4. ORS API Key

- To see road-following polylines, provide an OpenRouteService API key.
- You can place it in localStorage under `ORS_API_KEY`, or create a `.env` with `VITE_ORS_API_KEY` for Vite.

## Notes

- The app intentionally does not render straight-line fallbacks anymore; routes are only shown when valid ORS geometry is returned.
- If you want routes to always be visible during development, I can add a mock backend endpoint returning precomputed geometry.

## Backend: MongoDB drivers collection

This project now stores drivers in a MongoDB collection (Mongoose). The old Excel files were removed from the repository and replaced with `data/drivers-sample.csv` (header + dummy row). Use the import script to populate your database from Excel files locally.

1. Create a `.env` file based on `.env.example` and set `MONGODB_URI` and `JWT_SECRET`.

2. Install backend dependencies and run:
```powershell
cd vehicle-routing-backend
npm install
npm run dev
```

3. Import drivers from an Excel file (example):
```powershell
cd vehicle-routing-backend
node scripts/importDriversFromXlsx.js ../data/drivers.xlsx
```

API endpoints (JSON):
- `POST /api/drivers/register` — register a driver (returns id and userId)
- `POST /api/drivers/login` — login returns `{ token, expiresIn }`
- `GET /api/drivers/me` — protected, returns profile (exclude passwordHash)
- `POST /api/drivers/:id/add-distance` — protected, increments `distanceDriven`
- `GET /api/drivers` — protected admin-style list (excludes passwordHash)

Security notes:
- Passwords are stored as bcrypt hashes only. Do not store plaintext passwords.
- Do not commit `.env` files. Rotate secrets if they were previously committed.


## Contributing

Pull requests welcome. Please avoid committing secrets.

## License

MIT
