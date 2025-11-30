import React from 'react';
import Map from '../components/Map';

const MapDemo = () => {
  // Default to New York City coordinates
  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
  };

  // Ensure the container takes full viewport height minus header
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Fleet Location</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full">
          <Map 
            center={defaultCenter}
            zoom={12}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MapDemo;
