import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { Spinner } from '../ui/Spinner';
import { calculateDistance, formatDuration } from '../../utils/fleetUtils';

// Default map center (can be overridden via props)
const DEFAULT_CENTER = {
  lat: 20.5937,  // Center of India
  lng: 78.9629
};

// Map options
const MAP_OPTIONS = {
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Vehicle marker icons
const VEHICLE_ICONS = {
  active: {
    url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    scaledSize: { width: 32, height: 32 }
  },
  inactive: {
    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    scaledSize: { width: 32, height: 32 }
  },
  maintenance: {
    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    scaledSize: { width: 32, height: 32 }
  },
  default: {
    url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    scaledSize: { width: 32, height: 32 }
  }
};

/**
 * FleetMap Component
 * A reusable map component for displaying fleet vehicles and routes
 */
export const FleetMap = ({
  vehicles = [],
  center,
  zoom = 10,
  onMapLoad,
  onMapClick,
  onMarkerClick,
  selectedVehicle,
  showRoutes = false,
  showInfoWindows = true,
  style = { width: '100%', height: '500px' },
  loadingComponent,
  className = '',
  ...props
}) => {
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [routePath, setRoutePath] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeVehicleId, setRouteVehicleId] = useState(null);
  const mapRef = useRef();

  // Handle map load
  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
    if (onMapLoad) onMapLoad(map);
  }, [onMapLoad]);

  // Update bounds when vehicles change
  useEffect(() => {
    if (map && vehicles.length > 0) {
      const newBounds = new window.google.maps.LatLngBounds();
      vehicles.forEach(vehicle => {
        if (vehicle.position) {
          newBounds.extend(vehicle.position);
        }
      });
      
      // Only update bounds if we have valid positions
      if (!newBounds.isEmpty()) {
        map.fitBounds(newBounds);
        setBounds(newBounds);
      }
    }
  }, [map, vehicles]);

  // Handle map click
  const handleMapClick = useCallback((event) => {
    if (onMapClick) {
      onMapClick({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    }
  }, [onMapClick]);

  // Handle marker click
  const handleMarkerClick = useCallback(async (vehicle, event) => {
    if (onMarkerClick) {
      onMarkerClick(vehicle, event);
    }

    if (showInfoWindows) {
      setInfoWindow({
        vehicle,
        position: event.latLng
      });
    }

    // Clear previous route and mark loading
    setRouteVehicleId(vehicle.id ?? null);
    setRoutePath(null);
    if (typeof props.fetchRouteForVehicle === 'function') {
      try {
        setRouteLoading(true);
        const path = await props.fetchRouteForVehicle(vehicle);
        setRoutePath(path || null);
      } catch (err) {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.error('Error fetching route for vehicle:', err);
        setRoutePath(null);
      } finally {
        setRouteLoading(false);
      }
    } else if (vehicle.routePath && Array.isArray(vehicle.routePath)) {
      setRoutePath(vehicle.routePath);
    } else if (vehicle.path && Array.isArray(vehicle.path)) {
      setRoutePath(vehicle.path);
    } else {
      setRoutePath(null);
    }
  }, [onMarkerClick, showInfoWindows, props]);

  // Close info window
  const closeInfoWindow = useCallback(() => {
    setInfoWindow(null);
    setRoutePath(null);
    setRouteVehicleId(null);
  }, []);

  // Get appropriate icon for vehicle status
  const getVehicleIcon = (status) => {
    return VEHICLE_ICONS[status] || VEHICLE_ICONS.default;
  };

  // Render vehicle markers
  const renderVehicleMarkers = () => {
    return vehicles.map((vehicle) => {
      if (!vehicle.position) return null;
      
      return (
        <Marker
          key={vehicle.id}
          position={vehicle.position}
          icon={getVehicleIcon(vehicle.status)}
          onClick={(e) => handleMarkerClick(vehicle, e)}
          title={`${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`}
          zIndex={selectedVehicle?.id === vehicle.id ? 1000 : 1}
        />
      );
    });
  };

  // Render a detailed route polyline for the selected vehicle
  const renderRouteForVehicle = () => {
    if (!routePath || !Array.isArray(routePath) || routePath.length < 2) return null;
    return (
      <Polyline
        path={routePath}
        options={{
          strokeColor: '#4285F4',
          strokeOpacity: 0.95,
          strokeWeight: 4,
          geodesic: true
        }}
      />
    );
  };

  // Render vehicle info window
  const renderInfoWindow = () => {
    if (!infoWindow || !showInfoWindows) return null;
    
    const { vehicle, position } = infoWindow;
    const distance = selectedVehicle?.position && vehicle.position
      ? calculateDistance(
          selectedVehicle.position.lat,
          selectedVehicle.position.lng,
          vehicle.position.lat,
          vehicle.position.lng
        ).toFixed(2)
      : null;
    
    return (
      <InfoWindow
        position={position}
        onCloseClick={closeInfoWindow}
      >
        <div className="p-2 min-w-[200px]">
          <h3 className="font-medium text-gray-900">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
          
          {vehicle.status && (
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                vehicle.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : vehicle.status === 'maintenance'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </span>
            </div>
          )}
          
          {vehicle.speed && (
            <p className="mt-1 text-sm">
              <span className="font-medium">Speed:</span> {vehicle.speed} km/h
            </p>
          )}
          
          {distance !== null && selectedVehicle?.id !== vehicle.id && (
            <p className="mt-1 text-sm">
              <span className="font-medium">Distance:</span> {distance} km
            </p>
          )}
          
          {vehicle.eta && (
            <p className="mt-1 text-sm">
              <span className="font-medium">ETA:</span> {formatDuration(vehicle.eta)}
            </p>
          )}
        </div>
      </InfoWindow>
    );
  };

  const LoadingSpinner = loadingComponent || (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className={`relative ${className}`} style={style}>
      <LoadScript
        googleMapsApiKey={(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
        loadingElement={LoadingSpinner}
      >
        <GoogleMap
          mapContainerStyle={style}
          center={center || DEFAULT_CENTER}
          zoom={zoom}
          options={MAP_OPTIONS}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
          {...props}
        >
          {renderVehicleMarkers()}
          {renderRouteForVehicle()}
          {renderInfoWindow()}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

// Default props
FleetMap.defaultProps = {
  vehicles: [],
  showRoutes: false,
  showInfoWindows: true,
  zoom: 10
};

// Example usage:
/*
<FleetMap
  vehicles={[
    {
      id: 1,
      make: 'Tata',
      model: 'Ace',
      licensePlate: 'MH01AB1234',
      status: 'active',
      position: { lat: 19.0760, lng: 72.8777 }, // Mumbai
      speed: 45,
      eta: 30 // minutes
    },
    // More vehicles...
  ]}
  onMarkerClick={(vehicle) => console.log('Vehicle clicked:', vehicle)}
  showRoutes={true}
  style={{ width: '100%', height: '600px' }}
  className="rounded-lg shadow-lg"
/>
*/
