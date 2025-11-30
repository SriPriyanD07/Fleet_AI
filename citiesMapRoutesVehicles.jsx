// City pins data for the map
export const cityPins = [
  { city: 'Mumbai', lat: 19.0760, lng: 72.8777, deliveries: 25 },
  { city: 'Pune', lat: 18.5204, lng: 73.8567, deliveries: 18 },
  { city: 'Bengaluru', lat: 12.9716, lng: 77.5946, deliveries: 22 },
  { city: 'Mysuru', lat: 12.2958, lng: 76.6394, deliveries: 14 },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707, deliveries: 20 },
  { city: 'Coimbatore', lat: 11.0168, lng: 76.9558, deliveries: 12 },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639, deliveries: 16 },
  { city: 'Delhi', lat: 28.6139, lng: 77.2090, deliveries: 28 },
  { city: 'Hyderabad', lat: 17.3850, lng: 78.4867, deliveries: 19 },
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, deliveries: 15 },
  { city: 'Jaipur', lat: 26.9124, lng: 75.7873, deliveries: 13 },
  { city: 'Lucknow', lat: 26.8467, lng: 80.9462, deliveries: 11 },
  { city: 'Bhopal', lat: 23.2599, lng: 77.4126, deliveries: 9 },
  { city: 'Kochi', lat: 9.9312, lng: 76.2673, deliveries: 10 },
  { city: 'Patna', lat: 25.5941, lng: 85.1376, deliveries: 8 },
  { city: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, deliveries: 7 },
  { city: 'Chandigarh', lat: 30.7333, lng: 76.7794, deliveries: 12 },
  { city: 'Gurgaon', lat: 28.4595, lng: 77.0266, deliveries: 17 },
  { city: 'Dehradun', lat: 30.3165, lng: 78.0322, deliveries: 6 },
  { city: 'Thane', lat: 19.2183, lng: 72.9781, deliveries: 14 }
];

// Route data for vehicles
export const cityRoutes = [
  {
    vehicleNumber: 'MH12AB1234',
    start: 'Pune',
    end: 'Mumbai',
    waypoints: [
      { lat: 18.6298, lng: 73.7997 }, // Lonavala
    ]
  },
  {
    vehicleNumber: 'MH12AB2234',
    start: 'Mumbai',
    end: 'Pune',
    waypoints: [
      { lat: 19.1334, lng: 72.9133 }, // Thane
    ]
  },
  {
    vehicleNumber: 'KA01CD1234',
    start: 'Bengaluru',
    end: 'Mysuru',
    waypoints: [
      { lat: 12.5266, lng: 76.8945 }, // Mandya
    ]
  },
  {
    vehicleNumber: 'TN09EF1234',
    start: 'Chennai',
    end: 'Coimbatore',
    waypoints: [
      { lat: 12.9165, lng: 79.1325 }, // Vellore
    ]
  },
  {
    vehicleNumber: 'WB12GH3234',
    start: 'Kolkata',
    end: 'Patna',
    waypoints: [
      { lat: 22.6658, lng: 88.0852 }, // Serampore
    ]
  },
  {
    vehicleNumber: 'DL03IJ5678',
    start: 'Delhi',
    end: 'Jaipur',
    waypoints: [
      { lat: 28.4595, lng: 77.0266 }, // Gurgaon
    ]
  },
  {
    vehicleNumber: 'GJ05KL9012',
    start: 'Ahmedabad',
    end: 'Mumbai',
    waypoints: [
      { lat: 22.3072, lng: 73.1812 }, // Vadodara
    ]
  },
  {
    vehicleNumber: 'MH14MN3456',
    start: 'Mumbai',
    end: 'Pune',
    waypoints: [
      { lat: 19.2183, lng: 72.9781 }, // Thane
    ]
  },
  {
    vehicleNumber: 'KA02OP7890',
    start: 'Mysuru',
    end: 'Bengaluru',
    waypoints: [
      { lat: 12.2958, lng: 76.6394 }, // Mysuru
    ]
  },
  {
    vehicleNumber: 'TN10QR1234',
    start: 'Coimbatore',
    end: 'Chennai',
    waypoints: [
      { lat: 11.3410, lng: 77.7172 }, // Salem
    ]
  },
  {
    vehicleNumber: 'UP16ST5678',
    start: 'Lucknow',
    end: 'Delhi',
    waypoints: [
      { lat: 26.4499, lng: 80.3319 }, // Kanpur
    ]
  },
  {
    vehicleNumber: 'RJ14UV9012',
    start: 'Jaipur',
    end: 'Delhi',
    waypoints: [
      { lat: 27.5706, lng: 76.6118 }, // Alwar
    ]
  },
  {
    vehicleNumber: 'MP09WX3456',
    start: 'Bhopal',
    end: 'Delhi',
    waypoints: [
      { lat: 25.4484, lng: 78.5685 }, // Jhansi
    ]
  },
  {
    vehicleNumber: 'AP07YZ7890',
    start: 'Hyderabad',
    end: 'Chennai',
    waypoints: [
      { lat: 16.5062, lng: 80.6480 }, // Vijayawada
    ]
  },
  {
    vehicleNumber: 'KL08AB1234',
    start: 'Kochi',
    end: 'Chennai',
    waypoints: [
      { lat: 8.5241, lng: 76.9366 }, // Thiruvananthapuram
    ]
  },
  {
    vehicleNumber: 'BR01CD5678',
    start: 'Patna',
    end: 'Kolkata',
    waypoints: [
      { lat: 24.7955, lng: 85.0000 }, // Gaya
    ]
  },
  {
    vehicleNumber: 'OR02EF9012',
    start: 'Bhubaneswar',
    end: 'Kolkata',
    waypoints: [
      { lat: 20.9517, lng: 85.0985 }, // Cuttack
    ]
  },
  {
    vehicleNumber: 'PB03GH3456',
    start: 'Chandigarh',
    end: 'Delhi',
    waypoints: [
      { lat: 31.6340, lng: 74.8723 }, // Amritsar
    ]
  },
  {
    vehicleNumber: 'HR04IJ7890',
    start: 'Gurgaon',
    end: 'Delhi',
    waypoints: [
      { lat: 28.4089, lng: 77.3178 }, // Faridabad
    ]
  },
  {
    vehicleNumber: 'UK05KL1234',
    start: 'Dehradun',
    end: 'Delhi',
    waypoints: [
      { lat: 29.9457, lng: 78.1642 }, // Haridwar
    ]
  }
];
