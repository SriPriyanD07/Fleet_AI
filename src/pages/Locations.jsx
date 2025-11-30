import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cityPins, cityRoutes } from '../../citiesMapRoutesVehicles.jsx';
import { fetchORSRoute } from '../utils/ors';

// ORS API key: prefer Vite env or localStorage; fallback to provided key
// NOTE: Storing API keys in source is not recommended for security reasons.
const DEFAULT_ORS_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ORS_API_KEY) || 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijk3YmMwZmE4NGY1ZjQyZTc4YWFjZjVlMDI5OTM5MTZmIiwiaCI6Im11cm11cjY0In0=';
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
import LineString from 'ol/geom/LineString';
import Overlay from 'ol/Overlay';

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

export default function Locations() {
  const [loading, setLoading] = useState(false);
  const [orsKey, setOrsKey] = useState(() => {
    try {
      return localStorage.getItem('ORS_API_KEY') || DEFAULT_ORS_KEY || '';
    } catch (e) {
      return DEFAULT_ORS_KEY || '';
    }
  });
  // If a default key is provided, we can hide the manual input to avoid prompting the user
  const [showOrsInput, setShowOrsInput] = useState(() => {
    try {
      return !(DEFAULT_ORS_KEY && DEFAULT_ORS_KEY.length > 5);
    } catch (e) {
      return true;
    }
  });
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedRouteHasGeometry, setSelectedRouteHasGeometry] = useState(null);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const citySource = useRef(new VectorSource());
  const routeSource = useRef(new VectorSource());
  const popupOverlay = useRef(null);
  const popupElement = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    console.log('Initializing map...');
    
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: citySource.current }),
        new VectorLayer({ source: routeSource.current })
      ],
      view: new View({
        center: fromLonLat([DEFAULT_CENTER.lng, DEFAULT_CENTER.lat]),
        zoom: 5,
        minZoom: 3,
        maxZoom: 18
      }),
      controls: []
    });

    // Create popup overlay
    popupElement.current = document.createElement('div');
    popupElement.current.className = 'bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[250px] max-w-[350px] z-50';
    popupOverlay.current = new Overlay({
      element: popupElement.current,
      autoPan: true,
      autoPanAnimation: { duration: 250 }
    });
    map.addOverlay(popupOverlay.current);

    // Handle map clicks
    map.on('singleclick', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const data = feature.get('data');
        showPopup(data, evt.coordinate);
        // If a route feature is clicked, select it so we fetch/render the actual routing
        if (data && data.type === 'route') {
          setSelectedRoute(data);
        }
      } else {
        hidePopup();
      }
    });

    mapInstance.current = map;
    setMapInitialized(true);
    
    console.log('Map initialized successfully');
    
    // Load initial data after map is ready
    setTimeout(() => {
      loadCityPins();
      // Do not load all routes on initial load to avoid cluttering the map.
      // Routes will be loaded only when a route is selected by the user.
    }, 100);
  }, []);

  // If a default ORS key exists, persist it so the UI won't repeatedly ask the user.
  useEffect(() => {
    if (DEFAULT_ORS_KEY && DEFAULT_ORS_KEY.length > 5) {
      try {
        localStorage.setItem('ORS_API_KEY', DEFAULT_ORS_KEY);
        setOrsKey(DEFAULT_ORS_KEY);
        setShowOrsInput(false);
      } catch (e) {
        // ignore localStorage failures
      }
    }
  }, []);

  // Load city pins on map
  const loadCityPins = useCallback(() => {
    if (!citySource.current) return;
    
    console.log('Loading city pins...', cityPins.length);
    citySource.current.clear();
    
    cityPins.forEach((city, index) => {
      try {
        const feature = new Feature({
          geometry: new Point(fromLonLat([city.lng, city.lat])),
          data: { type: 'city', ...city }
        });
        
        feature.setStyle(createCityStyle(city.deliveries));
        citySource.current.addFeature(feature);
      } catch (error) {
        console.error('Error creating city feature:', city, error);
      }
    });
    
    console.log('City pins loaded:', citySource.current.getFeatures().length);
  }, []);

  // Create city marker style based on delivery count
  const createCityStyle = (deliveries) => {
    let color, radius;
    if (deliveries >= 15) {
      color = '#EF4444'; // Red for high delivery cities
      radius = 8;
    } else if (deliveries >= 10) {
      color = '#F59E0B'; // Orange for medium delivery cities
      radius = 6;
    } else {
      color = '#10B981'; // Green for low delivery cities
      radius = 4;
    }

    return new Style({
      image: new CircleStyle({
        radius,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#FFFFFF', width: 2 })
      }),
      text: new Text({
        text: deliveries.toString(),
        scale: 0.8,
        fill: new Fill({ color: '#FFFFFF' }),
        stroke: new Stroke({ color: '#000000', width: 0.5 })
      })
    });
  };

  // Load all routes on map using OpenRouteService
  const loadAllRoutes = useCallback(() => {
    if (!routeSource.current) return;
    console.log('Loading routes with ORS...', cityRoutes.length);
    routeSource.current.clear();

    cityRoutes.forEach(async (route, index) => {
      try {
        // Gather coordinates
        const coordinates = [];
        if (route.start && typeof route.start === 'string') {
          const startCity = cityPins.find(city => city.city === route.start);
          if (startCity) coordinates.push([startCity.lng, startCity.lat]);
        } else if (route.start && route.start.lng && route.start.lat) {
          coordinates.push([route.start.lng, route.start.lat]);
        }
        if (route.waypoints && Array.isArray(route.waypoints)) {
          route.waypoints.forEach(wp => {
            if (wp.lng && wp.lat) coordinates.push([wp.lng, wp.lat]);
          });
        }
        if (route.end && typeof route.end === 'string') {
          const endCity = cityPins.find(city => city.city === route.end);
          if (endCity) coordinates.push([endCity.lng, endCity.lat]);
        } else if (route.end && route.end.lng && route.end.lat) {
          coordinates.push([route.end.lng, route.end.lat]);
        }
        if (coordinates.length >= 2) {
          // Fetch actual route geometry from ORS (use local orsKey or DEFAULT_ORS_KEY)
          let geometry = null;
          try {
            const keyToUse = orsKey || DEFAULT_ORS_KEY || '';
            if (keyToUse) {
              const geojson = await fetchORSRoute(coordinates, keyToUse);
              if (geojson && geojson.features && geojson.features[0] && geojson.features[0].geometry) {
                geometry = geojson.features[0].geometry.coordinates;
              }
            }
            // Do NOT fallback to straight lines. If ORS fails or returns no geometry, skip rendering this route.
            if (!geometry) {
              if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.warn('No ORS geometry for route, skipping rendering', route.vehicleNumber);
              return;
            }
          } catch (err) {
            if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.warn('ORS fetch failed for route, skipping', route.vehicleNumber, err);
            return;
          }
          const feature = new Feature({
            geometry: new LineString(geometry.map(coord => fromLonLat(coord))),
            data: { type: 'route', ...route }
          });
          const isSelected = selectedRoute && selectedRoute.vehicleNumber === route.vehicleNumber;
          feature.setStyle(createRouteStyle(isSelected));
          routeSource.current.addFeature(feature);
        }
      } catch (error) {
        console.error('Error creating ORS route feature:', route, error);
      }
    });
    console.log('ORS routes loading triggered.');
  }, [selectedRoute, orsKey]);

  // Show popup with city/route information
  const showPopup = (data, coordinate) => {
    if (!popupElement.current || !popupOverlay.current) return;
    
    if (data.type === 'city') {
      popupElement.current.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">${data.city}</h3>
            <span class="px-2 py-1 text-xs font-medium rounded-full ${
              data.deliveries >= 15 ? 'bg-red-100 text-red-800' :
              data.deliveries >= 10 ? 'bg-orange-100 text-orange-800' :
              'bg-green-100 text-green-800'
            }">
              ${data.deliveries} deliveries
            </span>
          </div>
          <div class="text-sm text-gray-600">
            <p><strong>Coordinates:</strong> ${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}</p>
          </div>
          <div class="text-xs text-gray-500">
            <p>Click on a route to see vehicle details</p>
          </div>
        </div>
      `;
    } else if (data.type === 'route') {
      popupElement.current.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-blue-900">Route ${data.vehicleNumber}</h3>
            <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Active Route
            </span>
          </div>
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>From:</strong> ${data.start}</p>
            <p><strong>To:</strong> ${data.end}</p>
            <p><strong>Waypoints:</strong> ${data.waypoints ? data.waypoints.length : 0}</p>
          </div>
          <div class="text-xs text-gray-500">
            <p>Route distance and ETA available</p>
          </div>
        </div>
      `;
    }
    
    popupOverlay.current.setPosition(coordinate);
  };

  // Hide popup
  const hidePopup = () => {
    if (popupOverlay.current) {
      popupOverlay.current.setPosition(undefined);
    }
  };

  // Filter routes by vehicle number
  const filterRoutes = useCallback((vehicleNumber) => {
    if (!vehicleNumber) {
      setFilteredRoutes(cityRoutes);
      return;
    }
    
    const filtered = cityRoutes.filter(route => 
      route.vehicleNumber.toLowerCase().includes(vehicleNumber.toLowerCase())
    );
    setFilteredRoutes(filtered);
    
    // Center map on first filtered route
    if (filtered.length > 0 && mapInstance.current) {
      const route = filtered[0];
      let center = DEFAULT_CENTER;
      
      // Try to find coordinates for start and end cities
      if (route.start && route.end) {
        const startCity = cityPins.find(city => city.city === route.start);
        const endCity = cityPins.find(city => city.city === route.end);
        
        if (startCity && endCity) {
          center = {
            lat: (startCity.lat + endCity.lat) / 2,
            lng: (startCity.lng + endCity.lng) / 2
          };
        }
      }
      
      setMapCenter(center);
      setMapZoom(8);
    }
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (mapInstance.current && mapInitialized) {
      const view = mapInstance.current.getView();
      view.animate({
        center: fromLonLat([mapCenter.lng, mapCenter.lat]),
        zoom: mapZoom,
        duration: 1000
      });
    }
  }, [mapCenter, mapZoom, mapInitialized]);

  // Load filtered routes on map
  useEffect(() => {
    if (!mapInstance.current || !mapInitialized) return;
    // When a single route is selected, its rendering is handled in the selectedRoute effect below.
    if (selectedRoute) return;
    
    routeSource.current.clear();
    (async () => {
      for (const route of filteredRoutes) {
        try {
          const coordinates = [];

          // Add start point
          if (route.start && typeof route.start === 'string') {
            const startCity = cityPins.find(city => city.city === route.start);
            if (startCity) coordinates.push([startCity.lng, startCity.lat]);
          } else if (route.start && route.start.lng && route.start.lat) {
            coordinates.push([route.start.lng, route.start.lat]);
          }

          // Add waypoints
          if (route.waypoints && Array.isArray(route.waypoints)) {
            route.waypoints.forEach(wp => {
              if (wp.lng && wp.lat) coordinates.push([wp.lng, wp.lat]);
            });
          }

          // Add end point
          if (route.end && typeof route.end === 'string') {
            const endCity = cityPins.find(city => city.city === route.end);
            if (endCity) coordinates.push([endCity.lng, endCity.lat]);
          } else if (route.end && route.end.lng && route.end.lat) {
            coordinates.push([route.end.lng, route.end.lat]);
          }

          if (coordinates.length < 2) continue;

          // Attempt to fetch the actual routing geometry from ORS (if key provided). Do not fall back to straight segments; skip if unavailable.
          let geometry = null;
          try {
            const keyToUse = orsKey || DEFAULT_ORS_KEY || '';
            if (keyToUse) {
              const geojson = await fetchORSRoute(coordinates, keyToUse);
              if (geojson && geojson.features && geojson.features[0] && geojson.features[0].geometry) {
                geometry = geojson.features[0].geometry.coordinates;
              }
            }
            if (!geometry || !Array.isArray(geometry) || geometry.length < 2) {
              if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.warn('No ORS geometry for route, skipping rendering', route.vehicleNumber);
              continue; // skip rendering this route
            }
          } catch (err) {
            if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.warn('ORS fetch failed for route, skipping', route.vehicleNumber, err);
            continue;
          }

          const feature = new Feature({
            geometry: new LineString(geometry.map(coord => fromLonLat(coord))),
            data: { type: 'route', ...route }
          });

          const isSelected = selectedRoute && selectedRoute.vehicleNumber === route.vehicleNumber;
          feature.setStyle(createRouteStyle(isSelected));
          routeSource.current.addFeature(feature);
        } catch (error) {
          if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.error('Error creating filtered route feature:', route, error);
        }
      }
    })();
  }, [filteredRoutes, mapInitialized, selectedRoute, orsKey]);

  // When a route is selected, try to fetch and render its ORS geometry specifically.
  useEffect(() => {
    if (!mapInstance.current || !mapInitialized) return;
    if (!selectedRoute) {
      setSelectedRouteHasGeometry(null);
      return;
    }

    (async () => {
      routeSource.current.clear();
      setSelectedRouteHasGeometry(null);
      try {
        const coordinates = [];
        if (selectedRoute.start && typeof selectedRoute.start === 'string') {
          const startCity = cityPins.find(city => city.city === selectedRoute.start);
          if (startCity) coordinates.push([startCity.lng, startCity.lat]);
        } else if (selectedRoute.start && selectedRoute.start.lng && selectedRoute.start.lat) {
          coordinates.push([selectedRoute.start.lng, selectedRoute.start.lat]);
        }
        if (selectedRoute.waypoints && Array.isArray(selectedRoute.waypoints)) {
          selectedRoute.waypoints.forEach(wp => {
            if (wp.lng && wp.lat) coordinates.push([wp.lng, wp.lat]);
          });
        }
        if (selectedRoute.end && typeof selectedRoute.end === 'string') {
          const endCity = cityPins.find(city => city.city === selectedRoute.end);
          if (endCity) coordinates.push([endCity.lng, endCity.lat]);
        } else if (selectedRoute.end && selectedRoute.end.lng && selectedRoute.end.lat) {
          coordinates.push([selectedRoute.end.lng, selectedRoute.end.lat]);
        }

        if (coordinates.length < 2) {
          setSelectedRouteHasGeometry(false);
          return;
        }

        const keyToUse = orsKey || DEFAULT_ORS_KEY || '';
        if (!keyToUse) {
          setSelectedRouteHasGeometry(false);
          return;
        }

        const geojson = await fetchORSRoute(coordinates, keyToUse);
        const geometry = geojson && geojson.features && geojson.features[0] && geojson.features[0].geometry
          ? geojson.features[0].geometry.coordinates
          : null;
        if (!geometry || !Array.isArray(geometry) || geometry.length < 2) {
          setSelectedRouteHasGeometry(false);
          return;
        }

        const feature = new Feature({
          geometry: new LineString(geometry.map(coord => fromLonLat(coord))),
          data: { type: 'route', ...selectedRoute }
        });
        feature.setStyle(createRouteStyle(true));
        routeSource.current.addFeature(feature);
        setSelectedRouteHasGeometry(true);
      } catch (err) {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.warn('Selected route ORS fetch failed', err);
        setSelectedRouteHasGeometry(false);
      }
    })();
  }, [selectedRoute, mapInitialized, orsKey]);

  // Initialize filtered routes
  useEffect(() => {
    setFilteredRoutes(cityRoutes);
  }, []);

  // Update routes when selectedRoute changes
  useEffect(() => {
    if (mapInitialized) {
      if (selectedRoute) {
        // Show only the selected route
        setFilteredRoutes([selectedRoute]);
      } else {
        // If no route selected, show all active routes
        setFilteredRoutes(cityRoutes);
      }
    }
  }, [selectedRoute, mapInitialized]);

  // Create route line style
  const createRouteStyle = (isSelected = false) => {
    // Use blue tones for both selected and unselected routes to avoid the red straight-line visual.
    return new Style({
      stroke: new Stroke({
        color: isSelected ? '#1E40AF' : '#3B82F6', // Darker blue for selected, lighter blue for others
        width: isSelected ? 5 : 3,
        lineDash: isSelected ? [] : [5, 5] // Solid line for selected, dotted for others
      })
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Analysis & Delivery Verification</h1>
          <p className="mt-2 text-gray-600">
            Analyze vehicle routes, track deliveries, and monitor fleet performance across cities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => {
              setMapCenter(DEFAULT_CENTER);
              setMapZoom(5);
              setFilteredRoutes(cityRoutes);
              setSelectedVehicle('');
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Reset View
          </Button>
        </div>
      </div>

      {/* ORS API Key input (moved out of Active Routes) */}
      {showOrsInput ? (
        <div className="mt-4 mb-4 p-4 rounded-lg border max-w-md">
          <label className="text-sm font-medium text-gray-700">OpenRouteService API Key</label>
          <div className="mt-2 flex">
            <input
              type="text"
              value={orsKey}
              onChange={(e) => setOrsKey(e.target.value)}
              placeholder="Enter ORS API key"
              className="flex-1 px-3 py-2 border rounded-l-md text-sm"
            />
            <button
              onClick={() => { localStorage.setItem('ORS_API_KEY', orsKey); setShowOrsInput(false); }}
              className="px-3 py-2 bg-blue-600 text-white rounded-r-md text-sm"
            >
              Save
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Provide an ORS API key to render actual road routes. If empty or ORS fails, routes will not be drawn on the map.</p>
        </div>
      ) : (
        <div className="mt-4 mb-4 p-2 text-sm text-gray-500">Using configured ORS key to fetch road geometry.</div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Controls and Data */}
        <div className="lg:col-span-1 space-y-6">
          {/* Vehicle Filter */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Filter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number
                </label>
                <Input
                  type="text"
                  value={selectedVehicle}
                  onChange={(e) => {
                    setSelectedVehicle(e.target.value);
                    filterRoutes(e.target.value);
                  }}
                  placeholder="e.g., MH12AB1234"
                  className="w-full"
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>Found: {filteredRoutes.length} routes</p>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fleet Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Cities</span>
                <span className="text-sm font-medium">{cityPins.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Routes</span>
                <span className="text-sm font-medium">{cityRoutes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Deliveries</span>
                <span className="text-sm font-medium">
                  {cityPins.reduce((sum, city) => sum + city.deliveries, 0)}
                </span>
              </div>
            </div>
          </Card>

          {/* Route List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Active Routes</h3>
              {selectedRoute && (
                <Button
                  onClick={() => {
                    setSelectedRoute(null);
                    setMapCenter(DEFAULT_CENTER);
                    setMapZoom(5);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Show All Routes
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {(
                  (filteredRoutes && filteredRoutes.length > 0) ? filteredRoutes : cityRoutes
                ).map((route, index) => (
                <div
                  key={route.id ?? route.vehicleNumber ?? `${route.start ?? 's'}-${route.end ?? 'e'}-${index}`}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedRoute && selectedRoute.vehicleNumber === route.vehicleNumber
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (selectedRoute && selectedRoute.vehicleNumber === route.vehicleNumber) {
                      // If clicking the same route, deselect it
                      setSelectedRoute(null);
                      setMapCenter(DEFAULT_CENTER);
                      setMapZoom(5);
                    } else {
                      // Select the new route
                      let center = DEFAULT_CENTER;
                      
                      // Try to find coordinates for start and end cities
                      if (route.start && route.end) {
                        const startCity = cityPins.find(city => city.city === route.start);
                        const endCity = cityPins.find(city => city.city === route.end);
                        
                        if (startCity && endCity) {
                          center = {
                            lat: (startCity.lat + endCity.lat) / 2,
                            lng: (startCity.lng + endCity.lng) / 2
                          };
                        }
                      }
                      
                      setMapCenter(center);
                      setMapZoom(8);
                      setSelectedRoute(route);
                    }
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">{route.vehicleNumber}</div>
                  <div className="text-xs text-gray-500">
                    {route.start} → {route.end}
                  </div>
                  {selectedRoute && selectedRoute.vehicleNumber === route.vehicleNumber && (
                    <div className="text-xs text-blue-600 font-medium mt-1">
                      ✓ Selected Route
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side - Map and Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Map */}
          <Card className="overflow-hidden">
            <div className="h-[600px] w-full relative" ref={mapRef}>
              {!mapInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Spinner className="mx-auto mb-2" />
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Route Details */}
          {selectedRoute && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Route Details: {selectedRoute.vehicleNumber}
              </h3>
                  {selectedRouteHasGeometry === false && (
                    <div className="text-sm text-gray-500 mb-3">Route geometry not available (ORS key missing or request failed).</div>
                  )}
                  {selectedRouteHasGeometry === null && (
                    <div className="text-sm text-gray-500 mb-3">Checking route geometry...</div>
                  )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Start Point</h4>
                  <p className="text-sm text-gray-900">{selectedRoute.start}</p>
                  {selectedRoute.start && typeof selectedRoute.start === 'string' && (
                    (() => {
                      const startCity = cityPins.find(city => city.city === selectedRoute.start);
                      return startCity ? (
                        <p className="text-xs text-gray-500">
                          {startCity.lat.toFixed(4)}, {startCity.lng.toFixed(4)}
                        </p>
                      ) : null;
                    })()
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">End Point</h4>
                  <p className="text-sm text-gray-900">{selectedRoute.end}</p>
                  {selectedRoute.end && typeof selectedRoute.end === 'string' && (
                    (() => {
                      const endCity = cityPins.find(city => city.city === selectedRoute.end);
                      return endCity ? (
                        <p className="text-xs text-gray-500">
                          {endCity.lat.toFixed(4)}, {endCity.lng.toFixed(4)}
                        </p>
                      ) : null;
                    })()
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Waypoints</h4>
                  <p className="text-sm text-gray-900">
                    {selectedRoute.waypoints ? selectedRoute.waypoints.length : 0} stops
                  </p>
                  <p className="text-xs text-gray-500">Route optimization active</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


