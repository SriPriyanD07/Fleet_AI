import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { AlertTriangle } from 'lucide-react';

// Use Vite's environment variables
const MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

const vehicleIcons = {
  active: {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310B981"><path d="M18 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM5 20v-7H2v-2h15v5h-1.5c-.8 0-1.5.7-1.5 1.5v4H5zm14-2.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>'
    ),
    scaledSize: { width: 30, height: 30 },
    anchor: { x: 15, y: 15 },
  },
  inactive: {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239CA3AF"><path d="M18 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM5 20v-7H2v-2h15v5h-1.5c-.8 0-1.5.7-1.5 1.5v4H5zm14-2.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>'
    ),
    scaledSize: { width: 30, height: 30 },
    anchor: { x: 15, y: 15 },
  },
  warning: {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F59E0B"><path d="M18 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM5 20v-7H2v-2h15v5h-1.5c-.8 0-1.5.7-1.5 1.5v4H5zm14-2.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>'
    ),
    scaledSize: { width: 30, height: 30 },
    anchor: { x: 15, y: 15 },
  },
};

const MapComponent = ({ vehicles = [], center, zoom = 12 }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    
    const loadMap = async () => {
      try {
        const loader = new Loader({
          apiKey: MAP_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry'],
        });

        await loader.load();
        const { Map } = await google.maps.importLibrary('maps');
        
        // Ensure the map container exists
        if (!mapRef.current) return;
        
        const mapInstance = new Map(mapRef.current, {
          center: center || { lat: 0, lng: 0 },
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
        });

        setMap(mapInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please check your API key and internet connection.');
        setIsLoading(false);
      }
    };

    loadMap();
  }, [center, zoom, MAP_API_KEY]);

  // Update markers when vehicles or map changes
  useEffect(() => {
    if (!map || !google?.maps) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];

    // Add markers for each vehicle
    vehicles.forEach(vehicle => {
      if (!vehicle.lat || !vehicle.lng) return;

      const icon = vehicleIcons[vehicle.status] || vehicleIcons.inactive;
      
      const marker = new google.maps.Marker({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        map,
        title: vehicle.name || 'Vehicle',
        icon,
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold text-gray-900">${vehicle.name || 'Vehicle'}</h3>
            <p class="text-sm text-gray-600">Status: ${vehicle.status || 'N/A'}</p>
            <p class="text-sm text-gray-600">Location: ${vehicle.location || 'N/A'}</p>
            <p class="text-sm text-gray-600">Last Update: ${vehicle.lastUpdate || 'N/A'}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  }, [vehicles, map]);

  // Update center when prop changes
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [center, map]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 p-4">
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      {!MAP_API_KEY || MAP_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' && (
        <div className="absolute inset-0 bg-yellow-50 bg-opacity-90 flex items-center justify-center p-4">
          <div className="text-center">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-yellow-800">Google Maps API Key Required</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Please set your Google Maps API key in the .env file as VITE_GOOGLE_MAPS_API_KEY
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
