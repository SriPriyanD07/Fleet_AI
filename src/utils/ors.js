// src/utils/ors.js
// Utility to fetch actual route geometry from OpenRouteService

export async function fetchORSRoute(coords, apiKey) {
  // coords: Array of [lng, lat] pairs
  const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
  const body = {
    coordinates: coords,
    instructions: false
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error('ORS route fetch failed');
  const data = await response.json();
  return data;
}
