import React, { useState } from 'react';
import { X, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

// Mock data for vehicle details - in a real app, this would come from an API
const mockVehicles = {
  active: [
    { id: 1, name: 'Truck #101', plate: 'MH01AB1234', lastActive: '2 hours ago', driver: 'John Doe', license: 'DL1234567890', model: 'Tata 1212', year: '2020' },
    { id: 2, name: 'Van #201', plate: 'MH02CD4567', lastActive: '30 mins ago', driver: 'Jane Smith', license: 'DL9876543210', model: 'Maharana XUV', year: '2021' },
  ],
  inactive: [
    { id: 3, name: 'Car #301', plate: 'MH03EF7890', lastActive: '2 days ago', driver: 'Mike Johnson', license: 'DL4567890123', model: 'Maruti Swift', year: '2019' },
  ],
  maintenance: [
    { id: 4, name: 'Truck #102', plate: 'MH04GH1234', lastService: '2023-05-15', status: 'In Service', driver: 'Rajesh Kumar', license: 'DL7890123456', model: 'Ashok Leyland', year: '2018' },
  ],
  out_of_service: [
    { id: 5, name: 'Van #202', plate: 'MH05IJ5678', lastActive: '1 week ago', reason: 'Accident', driver: 'Amit Patel', license: 'DL2345678901', model: 'Tata Winger', year: '2020' },
  ]
};
  


const statusLabels = {
  active: 'Active Vehicles',
  inactive: 'Inactive Vehicles',
  maintenance: 'Under Maintenance',
  out_of_service: 'Out of Service'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-blue-100 text-blue-800',
  out_of_service: 'bg-red-100 text-red-800'
};

export const VehicleStatusReport = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Detailed Vehicle Status Report</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(mockVehicles).map(([status, vehicles]) => (
            <div key={status} className="border rounded-lg overflow-hidden">
              <div className={`px-4 py-2 ${statusColors[status] || 'bg-gray-100'}`}>
                <h3 className="font-medium">{statusLabels[status] || status.replace('_', ' ')}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {status === 'maintenance' ? 'Last Service' : 'Last Active'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {status === 'maintenance' ? 'Status' : 'Driver'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vehicle.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.plate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.lastActive || vehicle.lastService}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.driver || vehicle.status || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Close
          </Button>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleStatusReport;
