// This service will be used to load and process Excel data
// For now, we'll use the existing mock data structure

// List of Indian cities with their coordinates for mapping
const indianCities = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
  { name: 'Indore', lat: 22.7196, lng: 75.8577 },
  { name: 'Thane', lat: 19.2183, lng: 72.9781 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
  { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
  { name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
  { name: 'Agra', lat: 27.1767, lng: 78.0081 },
  { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
  { name: 'Patna', lat: 25.5941, lng: 85.1376 },
  { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
  { name: 'Meerut', lat: 28.9845, lng: 77.7064 },
  { name: 'Rajkot', lat: 22.3039, lng: 70.8022 },
  { name: 'Kalyan', lat: 19.2403, lng: 73.1305 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
  { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
  { name: 'Puducherry', lat: 11.9416, lng: 79.8083 },
  { name: 'Raipur', lat: 21.2514, lng: 81.6296 },
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
  { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 }
];

// Helper function to get a random city
const getRandomCity = () => indianCities[Math.floor(Math.random() * indianCities.length)].name;

// Mock data that matches the Excel structure
export const mockDriverData = [
  { id: 1, driverName: 'Rajesh Yadav', vehicleNumber: 'MH12AB1234', licenseNo: 'MH142019001223', delivered: 12, startLocation: 'Pune' },
  { id: 2, driverName: 'Sunil Shinde', vehicleNumber: 'MH12AB2234', licenseNo: 'MH142017001124', delivered: 9, startLocation: 'Pune' },
  { id: 3, driverName: 'Ajay Kumar', vehicleNumber: 'KA01CD1234', licenseNo: 'KA192015005482', delivered: 20, startLocation: 'Bengaluru' },
  { id: 4, driverName: 'Ramesh Kumar', vehicleNumber: 'TN09EF1234', licenseNo: 'TN102018006793', delivered: 8, startLocation: 'Chennai' },
  { id: 5, driverName: 'Pratik Sarkar', vehicleNumber: 'WB12GH3234', licenseNo: 'WB122021006922', delivered: 9, startLocation: 'Kolkata' },
  { id: 6, driverName: 'Vikram Singh', vehicleNumber: 'DL03IJ5678', licenseNo: 'DL032018009876', delivered: 15, startLocation: 'Delhi' },
  { id: 7, driverName: 'Rajiv Mehta', vehicleNumber: 'GJ05KL9012', licenseNo: 'GJ052019008765', delivered: 11, startLocation: 'Ahmedabad' },
  { id: 8, driverName: 'Sanjay Patel', vehicleNumber: 'MH14MN3456', licenseNo: 'MH142020007654', delivered: 18, startLocation: 'Mumbai' },
  { id: 9, driverName: 'Amit Sharma', vehicleNumber: 'KA02OP7890', licenseNo: 'KA022021006543', delivered: 14, startLocation: 'Mysuru' },
  { id: 10, driverName: 'Rahul Desai', vehicleNumber: 'TN10QR1234', licenseNo: 'TN102022005432', delivered: 7, startLocation: 'Coimbatore' },
  { id: 11, driverName: 'Deepak Verma', vehicleNumber: 'UP16ST5678', licenseNo: 'UP162019004321', delivered: 16, startLocation: 'Lucknow' },
  { id: 12, driverName: 'Anil Kapoor', vehicleNumber: 'RJ14UV9012', licenseNo: 'RJ142018003210', delivered: 10, startLocation: 'Jaipur' },
  { id: 13, driverName: 'Vijay Malhotra', vehicleNumber: 'MP09WX3456', licenseNo: 'MP092020002109', delivered: 13, startLocation: 'Bhopal' },
  { id: 14, driverName: 'Suresh Reddy', vehicleNumber: 'AP07YZ7890', licenseNo: 'AP072019001098', delivered: 17, startLocation: 'Hyderabad' },
  { id: 15, driverName: 'Arun Kumar', vehicleNumber: 'KL08AB1234', licenseNo: 'KL082018009876', delivered: 12, startLocation: 'Kochi' },
  { id: 16, driverName: 'Manoj Tiwari', vehicleNumber: 'BR01CD5678', licenseNo: 'BR012019008765', delivered: 19, startLocation: 'Patna' },
  { id: 17, driverName: 'Ravi Shastri', vehicleNumber: 'OR02EF9012', licenseNo: 'OR022020007654', delivered: 8, startLocation: 'Bhubaneswar' },
  { id: 18, driverName: 'Nitin Gupta', vehicleNumber: 'PB03GH3456', licenseNo: 'PB032021006543', delivered: 14, startLocation: 'Chandigarh' },
  { id: 19, driverName: 'Pankaj Mishra', vehicleNumber: 'HR04IJ7890', licenseNo: 'HR042022005432', delivered: 11, startLocation: 'Gurgaon' },
  { id: 20, driverName: 'Alok Joshi', vehicleNumber: 'UK05KL1234', licenseNo: 'UK052019004321', delivered: 16, startLocation: 'Dehradun' }
];

// Function to get all drivers
export const getAllDrivers = async () => {
  // Always assign a new random endLocation different from startLocation
  return mockDriverData.map(driver => {
    const availableCities = indianCities.filter(city => city.name !== driver.startLocation);
    const endCity = availableCities[Math.floor(Math.random() * availableCities.length)].name;
    return { ...driver, endLocation: endCity };
  });
};

// Function to get driver by ID
export const getDriverById = async (id) => {
  const drivers = await getAllDrivers();
  return drivers.find(driver => driver.id === parseInt(id));
};

// Function to get drivers by vehicle number
export const getDriversByVehicle = async (vehicleNumber) => {
  const drivers = await getAllDrivers();
  return drivers.filter(driver => driver.vehicleNumber === vehicleNumber);
};

export default {
  getAllDrivers,
  getDriverById,
  getDriversByVehicle
};
