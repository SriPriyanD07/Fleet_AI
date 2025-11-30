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

## Contributing

Pull requests welcome. Please avoid committing secrets.

## License

MIT
