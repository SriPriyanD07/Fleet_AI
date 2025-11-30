import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Truck, User } from 'lucide-react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style';
import OSM from 'ol/source/OSM';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';

const VehicleMap = ({ className = '', vehicles = [], orders = [], showControls = false }) => {
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const vectorSource = useRef(new VectorSource());
  const defaultCenter = [78.9629, 20.5937]; // [longitude, latitude] for India
  const zoom = 5;

  // Initialize map with a slight delay to ensure container sizing is correct
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let map;
    let vectorLayer;
    let popup;

    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.log('Initializing map...');

    try {
      // Create map instance
      map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM({
              url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              crossOrigin: 'anonymous'
            })
          })
        ],
        view: new View({
          center: fromLonLat(defaultCenter),
          zoom: zoom,
          minZoom: 2,
          maxZoom: 18
        }),
        controls: showControls ? [] : []
      });
      
      // Hide OSM attribution if not showing controls
      if (!showControls) {
        const attribution = mapRef.current.getElementsByClassName('ol-attribution')[0];
        if (attribution) {
          attribution.style.display = 'none';
        }
      }

      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.log('Map instance created');

      // Create vector source and layer
      const source = new VectorSource();
      vectorLayer = new VectorLayer({
        source: source,
        style: getFeatureStyle,
        updateWhileAnimating: true,
        updateWhileInteracting: true
      });
      
      // Store the source in the ref
      vectorSource.current = source;
      
      // Add vector layer to map
      map.addLayer(vectorLayer);
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.log('Vector layer added to map');
      
      // Create popup overlay
      popup = new Overlay({
        element: document.createElement('div'),
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      map.addOverlay(popup);
      
      // Handle click on features
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
        const element = popup.getElement();
        
        if (feature) {
          const coordinates = feature.getGeometry().getCoordinates();
          const name = feature.get('name') || 'Unknown';
          const type = feature.get('type') || 'Unknown';
          
          const status = feature.get('status') || 'inactive';
          const isDriver = type === 'driver';
          const location = feature.get('location') || 'Unknown';
          const vehicle = feature.get('vehicle') || 'N/A';
          const license = feature.get('license') || 'N/A';
          
          // Calculate popup position (always 80px above the marker)
          const pixel = map.getPixelFromCoordinate(coordinates);
          const offsetY = -80; // pixels above the marker
          const newPixel = [pixel[0], pixel[1] + offsetY];
          const popupCoords = map.getCoordinateFromPixel(newPixel);
          popup.setPosition(popupCoords);

          element.innerHTML = `
            <div class="bg-white p-3 rounded shadow-lg border border-gray-200 w-64">
              <div class="flex items-center space-x-2">
                <div class="text-xl">${isDriver ? '👤' : '🚚'}</div>
                <div class="font-bold">${name}</div>
              </div>
              <div class="mt-2 text-sm space-y-1">
                <div><span class="font-medium">Type:</span> ${isDriver ? 'Driver' : type}</div>
                ${isDriver ? `<div><span class="font-medium">Vehicle:</span> ${vehicle}</div>` : ''}
                ${isDriver ? `<div><span class="font-medium">License:</span> ${license}</div>` : ''}
                <div><span class="font-medium">Location:</span> ${location}</div>
                <div class="flex items-center">
                  <span class="font-medium">Status: </span>
                  <span class="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    status === 'active' ? 'bg-green-100 text-green-800' : 
                    status === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                    status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800' // inactive
                  }">
                  ${status}
                </span>
              </div>
            </div>
          `;
        } else {
          popup.setPosition(undefined);
        }
      });
      
      // Change cursor when hovering over features
      map.on('pointermove', (e) => {
        const pixel = map.getEventPixel(e.originalEvent);
        const hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });

      // Force a resize to ensure the map renders correctly
      setTimeout(() => {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.log('Updating map size...');
        map.updateSize();
        
        // Set initial view
        const view = map.getView();
        view.setCenter(fromLonLat(defaultCenter));
        view.setZoom(zoom);
        
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.log('Map initialized successfully');
      }, 100);

      mapInstance.current = map;
    } catch (error) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.error('Error initializing map:', error);
      return;
    }

    // Cleanup function
    return () => {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.log('Cleaning up map...');
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
      if (popup) {
        popup.setPosition(undefined);
      }
    };
  }, []);

  // Get status based on driver ID
  const getStatusByDriverId = (id) => {
    const activeIds = [1, 3, 5, 7, 8, 11, 13, 15, 18, 19, 20];
    const maintenanceIds = [2, 4, 6, 9, 10];
    const inactiveIds = [12, 16];
    const warningIds = [17];
    
    if (activeIds.includes(Number(id))) return 'active';
    if (maintenanceIds.includes(Number(id))) return 'maintenance';
    if (inactiveIds.includes(Number(id))) return 'inactive';
    if (warningIds.includes(Number(id))) return 'warning';
    return 'inactive';
  };

  // Create a style function for vehicle and driver markers
  const getFeatureStyle = (feature) => {
    const type = feature.get('type') || 'truck';
    const isDriver = type === 'driver';
    const id = feature.get('id');
    const status = isDriver ? getStatusByDriverId(id) : feature.get('status') || 'inactive';
    
    const colors = {
      active: '#10B981',    // green-500 for active
      maintenance: '#3B82F6', // blue-500 for maintenance
      inactive: '#6B7280',  // gray-500 for inactive
      warning: '#F59E0B',   // yellow-500 for warning
      error: '#EF4444'      // red-500 for error
    };
    
    const color = colors[status] || colors.inactive;
    
    return new Style({
      image: new CircleStyle({
        radius: isDriver ? 6 : 7,
        fill: new Fill({ color }),
        stroke: new Stroke({
          color: '#FFFFFF',
          width: 2,
        }),
      }),
      text: isDriver ? new Text({
        text: '👤',
        scale: 1.2,
        offsetY: -10,
      }) : null
    });
  };

  // Update features when vehicles prop changes
  useEffect(() => {
    if (!vectorSource.current) return;
    
    // Clear existing features
    vectorSource.current.clear();
    
    const features = [];
    
    // City coordinates for mapping orders to locations
    const cityCoordinates = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.6139, lng: 77.2090 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'Jaipur': { lat: 26.9124, lng: 75.7873 },
      'Lucknow': { lat: 26.8467, lng: 80.9462 },
      'Surat': { lat: 21.1702, lng: 72.8311 },
      'Kanpur': { lat: 26.4499, lng: 80.3319 },
      'Nagpur': { lat: 21.1458, lng: 79.0882 },
      'Indore': { lat: 22.7196, lng: 75.8577 },
      'Thane': { lat: 19.2183, lng: 72.9781 },
      'Bhopal': { lat: 23.2599, lng: 77.4126 },
      'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
      'Vadodara': { lat: 22.3072, lng: 73.1812 },
      'Ghaziabad': { lat: 28.4089, lng: 77.3178 },
      'Ludhiana': { lat: 30.9010, lng: 75.8573 },
      'Agra': { lat: 27.1767, lng: 78.0081 },
      'Nashik': { lat: 19.9975, lng: 73.7898 },
      'Patna': { lat: 25.5941, lng: 85.1376 },
      'Faridabad': { lat: 28.4089, lng: 77.3178 },
      'Meerut': { lat: 28.9845, lng: 77.7064 },
      'Rajkot': { lat: 22.3039, lng: 70.8022 },
      'Kalyan': { lat: 19.2403, lng: 73.1305 },
      'Varanasi': { lat: 25.3176, lng: 82.9739 },
      'Amritsar': { lat: 31.6340, lng: 74.8723 },
      'Coimbatore': { lat: 11.0168, lng: 76.9558 },
      'Kochi': { lat: 9.9312, lng: 76.2673 },
      'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
      'Guwahati': { lat: 26.1445, lng: 91.7362 },
      'Chandigarh': { lat: 30.7333, lng: 76.7794 },
      'Dehradun': { lat: 30.3165, lng: 78.0322 },
      'Mysuru': { lat: 12.2958, lng: 76.6394 },
      'Bengaluru': { lat: 12.9716, lng: 77.5946 },
    };
    
    if (vehicles && vehicles.length > 0) {
      // Show all vehicles from the Excel data, not just 20
      const excelVehicles = vehicles
        .filter(item => item.type === 'driver')
        .filter(item => item.lat != null && item.lng != null); // Only show vehicles with valid coordinates
      
      console.log(`Processing ${excelVehicles.length} vehicles for map display`);
      
      // Add new features for each vehicle
      excelVehicles.forEach(item => {
        try {
          const isDriver = item.type === 'driver';
          const lng = parseFloat(item.lng);
          const lat = parseFloat(item.lat);
          
          if (isNaN(lat) || isNaN(lng)) {
            console.error(`Invalid coordinates for ${isDriver ? 'driver' : 'vehicle'} ${item.id}:`, { lat: item.lat, lng: item.lng });
            return;
          }
          
          const status = getStatusByDriverId(item.id);
          const feature = new Feature({
            geometry: new Point(fromLonLat([lng, lat])),
            id: item.id,
            name: isDriver ? item.driverName || `Driver ${item.id}` : item.name || `Vehicle ${item.id}`,
            type: item.type || 'truck',
            status: status,
            vehicle: item.vehicleNumber || 'N/A',
            license: item.licenseNo || 'N/A',
            location: item.endLocation || 'Unknown',
            statusText: status.charAt(0).toUpperCase() + status.slice(1)
          });
          
          features.push(feature);
        } catch (error) {
          console.error('Error processing vehicle/driver:', item, error);
        }
      });
    }
    
    // Add order delivery points
    if (orders && orders.length > 0) {
      console.log(`Processing ${orders.length} orders for map display`);
      
      // Group orders by vehicle number to avoid duplicate markers
      const vehicleOrderGroups = {};
      orders.forEach(order => {
        const vehicleNumber = order['Vehicle Number'];
        if (vehicleNumber) {
          if (!vehicleOrderGroups[vehicleNumber]) {
            vehicleOrderGroups[vehicleNumber] = [];
          }
          vehicleOrderGroups[vehicleNumber].push(order);
        }
      });
      
      // Create one marker per vehicle with order count
      Object.entries(vehicleOrderGroups).forEach(([vehicleNumber, vehicleOrders]) => {
        try {
          // Use the first order's data for the marker
          const firstOrder = vehicleOrders[0];
          const customerName = firstOrder['Customer Name'] || 'Unknown';
          const status = firstOrder['Status'] || 'Unknown';
          
          // Map status to color
          const statusColors = {
            'Delivered': '#10B981',      // green
            'In Progress': '#3B82F6',    // blue
            'Pending': '#F59E0B',        // yellow
            'Cancelled': '#EF4444',      // red
            'default': '#6B7280'         // gray
          };
          
          // Assign coordinates based on vehicle number pattern or use default
          let lat, lng;
          if (vehicleNumber.includes('MH12AB')) {
            // Mumbai area
            lat = 19.0760 + (Math.random() * 0.1 - 0.05);
            lng = 72.8777 + (Math.random() * 0.1 - 0.05);
          } else if (vehicleNumber.includes('MH12CD')) {
            // Delhi area
            lat = 28.6139 + (Math.random() * 0.1 - 0.05);
            lng = 77.2090 + (Math.random() * 0.1 - 0.05);
          } else {
            // Random city from the list
            const cities = Object.values(cityCoordinates);
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            lat = randomCity.lat + (Math.random() * 0.1 - 0.05);
            lng = randomCity.lng + (Math.random() * 0.1 - 0.05);
          }
          
          const feature = new Feature({
            geometry: new Point(fromLonLat([lng, lat])),
            id: `order-${vehicleNumber}`,
            name: `Vehicle ${vehicleNumber}`,
            type: 'order',
            status: status.toLowerCase(),
            vehicle: vehicleNumber,
            customer: customerName,
            orderCount: vehicleOrders.length,
            statusText: status,
            payload: {
              vehicle: vehicleNumber,
              customer: customerName,
              status: status,
              orderCount: vehicleOrders.length,
              coords: { lat, lng }
            }
          });
          
          features.push(feature);
        } catch (error) {
          console.error('Error processing order:', error);
        }
      });
    }

    if (features.length > 0) {
      try {
        // Add features to the vector source
        vectorSource.current.addFeatures(features);
        
        // Fit the view to show all features
        const extent = vectorSource.current.getExtent();
        if (extent && !isNaN(extent[0]) && !isNaN(extent[1]) && !isNaN(extent[2]) && !isNaN(extent[3])) {
          mapInstance.current.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 1000
          });
        }
        
        // Force update
        mapInstance.current.updateSize();
      } catch (error) {
        console.error('Error fitting view to features:', error);
      }
    } else {
      console.warn('No valid coordinates found in the provided data');
    }
  }, [vehicles, orders]);

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className={`relative ${className}`} style={{ height: '100%', width: '100%' }}>
        <div 
          ref={mapRef} 
          className="absolute top-0 left-0 w-full h-full"
          style={{ minHeight: '300px' }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center p-6">
              <Truck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No vehicle location data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <div 
        ref={mapRef} 
        className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-lg"
        style={{ 
          minHeight: '300px',
          zIndex: 0
        }}
      >
        {(!vehicles || vehicles.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center p-6">
              <Truck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No vehicle location data available</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow text-sm text-gray-700 z-10">
          {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} shown
        </div>
      </div>
      <style jsx global>{`
        .ol-zoom {
          display: none;
        }
        .ol-attribution {
          display: none !important;
        }
        .ol-viewport {
          border-radius: 0.5rem !important;
          height: 100% !important;
          width: 100% !important;
        }
        .ol-layer {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
        .ol-unselectable {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default VehicleMap;
