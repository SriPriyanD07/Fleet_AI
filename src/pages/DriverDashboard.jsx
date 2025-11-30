import React, { useState, useEffect, useRef } from 'react';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const mapRef = useRef(null);
  const [currentSpeed, setCurrentSpeed] = useState(45);
  const [speedThreshold] = useState(60);
  const [showSpeedWarning, setShowSpeedWarning] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  // Driver data from your existing driver database
  const [driverData, setDriverData] = useState({
    name: 'Rajesh Yadav',
    id: 'MH12AB1234',
    license: 'MH14201900123',
    phone: '+91-9876543210',
    experience: '5 years',
    vehicleId: 'MH12AB1234',
    licensePlate: 'MH12AB1234',
    vehicleModel: 'Tata 407 2021',
    mileage: '8-10 km/l',
    fuelType: 'Diesel',
    fuelLevel: '75%',
    leaveAvailable: '12 days',
    leaveUsed: '8 days',
    leaveThisMonth: '2 days',
    todayDeliveries: 12,
    hoursWorked: '6.5h',
    distanceCovered: '245km',
    rating: '4.8'
  });

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'delivered',
      title: 'Delivery Completed',
      details: 'Package delivered to 456 Oak Ave',
      time: '2:30 PM',
      icon: 'fas fa-check-circle'
    },
    {
      id: 2,
      type: 'pickup',
      title: 'Package Picked Up',
      details: 'Collected from Warehouse B',
      time: '1:45 PM',
      icon: 'fas fa-box-open'
    },
    {
      id: 3,
      type: 'started',
      title: 'Shift Started',
      details: 'Logged in and vehicle checked',
      time: '9:00 AM',
      icon: 'fas fa-play-circle'
    }
  ]);

  // Initialize map
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current && window.L) {
        try {
          const newMap = window.L.map(mapRef.current).setView([28.6139, 77.2090], 13);
          
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(newMap);

          // Add driver marker
          window.L.marker([28.6139, 77.2090])
            .addTo(newMap)
            .bindPopup('Your Current Location');

          // Add sample route
          const routeCoordinates = [
            [28.6139, 77.2090],
            [28.6169, 77.2100],
            [28.6199, 77.2120],
            [28.6229, 77.2140],
            [28.6259, 77.2160]
          ];

          window.L.polyline(routeCoordinates, {
            color: '#667eea',
            weight: 4,
            opacity: 0.8
          }).addTo(newMap);

          // Add delivery points
          routeCoordinates.forEach((coord, index) => {
            if (index > 0) {
              window.L.marker(coord)
                .addTo(newMap)
                .bindPopup(`Delivery Point ${index}`);
            }
          });

          // Add danger zones
          window.L.circle([28.6180, 77.2110], {
            color: '#ff9800',
            fillColor: '#ff9800',
            fillOpacity: 0.2,
            radius: 200
          }).addTo(newMap).bindPopup('School Zone - Speed Limit: 25 km/h');

          window.L.circle([28.6220, 77.2130], {
            color: '#f44336',
            fillColor: '#f44336',
            fillOpacity: 0.2,
            radius: 150
          }).addTo(newMap).bindPopup('Construction Zone - Speed Limit: 30 km/h');

        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }
    };

    const timer = setTimeout(() => {
      initMap();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Speed monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const newSpeed = Math.floor(Math.random() * 80) + 20;
      setCurrentSpeed(newSpeed);
      
      if (newSpeed > speedThreshold) {
        setShowSpeedWarning(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [speedThreshold]);

  // Update last updated time
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSpeedStatus = () => {
    if (currentSpeed > speedThreshold) {
      return { text: 'Overspeed', className: 'speed-status danger' };
    } else if (currentSpeed > speedThreshold * 0.9) {
      return { text: 'Warning', className: 'speed-status warning' };
    }
    return { text: 'Normal', className: 'speed-status normal' };
  };

  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  const handleEmergencyReport = (type) => {
    const emergencyTypes = {
      accident: 'Vehicle Accident',
      breakdown: 'Vehicle Breakdown',
      medical: 'Medical Emergency',
      security: 'Security Issue',
      other: 'General Emergency'
    };

    const emergencyType = emergencyTypes[type] || 'Emergency';
    setShowEmergencyModal(false);
    showNotification(`${emergencyType} reported successfully. Help is on the way!`, 'success', 8000);
    
    // Add to activities
    const newActivity = {
      id: Date.now(),
      type: 'emergency',
      title: `${emergencyType} Reported`,
      details: 'Emergency services contacted',
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      icon: 'fas fa-exclamation-triangle'
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Navigate back to login
      window.location.href = '/';
    }
  };

  const speedStatus = getSpeedStatus();

  return (
    <div className="dashboard-container">
      {/* Speed Warning Modal */}
      {showSpeedWarning && (
        <div className="speed-warning-modal show">
          <div className="modal-content">
            <div className="warning-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Speed Warning</h3>
            <p>
              {isInDangerZone 
                ? `DANGER: You are in a restricted zone! Current speed: ${currentSpeed} km/h. Speed limit: ${speedThreshold} km/h`
                : `Speed Warning: Current speed ${currentSpeed} km/h exceeds limit of ${speedThreshold} km/h`
              }
            </p>
            <button 
              className="acknowledge-btn" 
              onClick={() => setShowSpeedWarning(false)}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="emergency-modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Emergency Report</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowEmergencyModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="emergency-options">
              <button 
                className="emergency-option accident" 
                onClick={() => handleEmergencyReport('accident')}
              >
                <i className="fas fa-car-crash"></i>
                <span>Accident</span>
              </button>
              <button 
                className="emergency-option breakdown" 
                onClick={() => handleEmergencyReport('breakdown')}
              >
                <i className="fas fa-wrench"></i>
                <span>Vehicle Breakdown</span>
              </button>
              <button 
                className="emergency-option medical" 
                onClick={() => handleEmergencyReport('medical')}
              >
                <i className="fas fa-heartbeat"></i>
                <span>Medical Emergency</span>
              </button>
              <button 
                className="emergency-option security" 
                onClick={() => handleEmergencyReport('security')}
              >
                <i className="fas fa-shield-alt"></i>
                <span>Security Issue</span>
              </button>
              <button 
                className="emergency-option other" 
                onClick={() => handleEmergencyReport('other')}
              >
                <i className="fas fa-exclamation-circle"></i>
                <span>Other Emergency</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-truck"></i>
            <span>FleetTrack</span>
          </div>
        </div>

        {/* Driver Profile Section */}
        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="profile-info">
              <h3>{driverData.name}</h3>
              <span className="status-active">On Duty</span>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Driver ID:</span>
              <span className="value">{driverData.id}</span>
            </div>
            <div className="detail-item">
              <span className="label">License:</span>
              <span className="value">{driverData.license}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{driverData.phone}</span>
            </div>
            <div className="detail-item">
              <span className="label">Experience:</span>
              <span className="value">{driverData.experience}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="vehicle-section">
          <h4><i className="fas fa-car"></i> Vehicle Details</h4>
          <div className="vehicle-details">
            <div className="detail-item">
              <span className="label">License Plate:</span>
              <span className="value">{driverData.licensePlate}</span>
            </div>
            <div className="detail-item">
              <span className="label">Model:</span>
              <span className="value">{driverData.vehicleModel}</span>
            </div>
            <div className="detail-item">
              <span className="label">Mileage:</span>
              <span className="value">{driverData.mileage}</span>
            </div>
            <div className="detail-item">
              <span className="label">Fuel Type:</span>
              <span className="value">{driverData.fuelType}</span>
            </div>
            <div className="detail-item">
              <span className="label">Fuel Level:</span>
              <span className="value">{driverData.fuelLevel}</span>
            </div>
          </div>
        </div>

        {/* Leave Information */}
        <div className="leave-section">
          <h4><i className="fas fa-calendar-alt"></i> Leave Status</h4>
          <div className="leave-details">
            <div className="detail-item">
              <span className="label">Available:</span>
              <span className="value">{driverData.leaveAvailable}</span>
            </div>
            <div className="detail-item">
              <span className="label">Used:</span>
              <span className="value">{driverData.leaveUsed}</span>
            </div>
            <div className="detail-item">
              <span className="label">This Month:</span>
              <span className="value">{driverData.leaveThisMonth}</span>
            </div>
          </div>
        </div>

        {/* Work Metrics */}
        <div className="orders-section">
          <h4><i className="fas fa-clipboard-list"></i> Work Metrics</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-box"></i>
              </div>
              <div className="metric-info">
                <span className="metric-value">{driverData.todayDeliveries}</span>
                <span className="metric-label">Today's Deliveries</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="metric-info">
                <span className="metric-value">{driverData.hoursWorked}</span>
                <span className="metric-label">Hours Worked</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-route"></i>
              </div>
              <div className="metric-info">
                <span className="metric-value">{driverData.distanceCovered}</span>
                <span className="metric-label">Distance Today</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="metric-info">
                <span className="metric-value">{driverData.rating}</span>
                <span className="metric-label">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <h2>Driver Dashboard</h2>
            <span className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </span>
          </div>
          <div className="header-right">
            <div className="driver-info">
              <span className="driver-name">{driverData.name}</span>
              <span className="vehicle-plate">{driverData.licensePlate}</span>
            </div>
            <div className="emergency-button">
              <button 
                className="emergency-btn" 
                onClick={() => setShowEmergencyModal(true)}
              >
                <i className="fas fa-exclamation-triangle"></i>
                Emergency
              </button>
            </div>
            <div className="user-menu">
              <button 
                className="user-btn" 
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <i className="fas fa-user-circle"></i>
                <i className="fas fa-chevron-down"></i>
              </button>
              {showUserMenu && (
                <div className="user-dropdown show">
                  <a href="#" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Status Cards */}
          <div className="status-cards">
            <div className="status-card current-speed">
              <div className="card-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <div className="card-content">
                <h4>Current Speed</h4>
                <span className="speed-value">{currentSpeed}</span>
                <span className="speed-unit">km/h</span>
              </div>
              <div className={speedStatus.className}>{speedStatus.text}</div>
            </div>
            
            <div className="status-card next-delivery">
              <div className="card-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="card-content">
                <h4>Next Delivery</h4>
                <span className="delivery-address">Pune Railway Station</span>
                <span className="delivery-eta">ETA: 15 min</span>
              </div>
            </div>
            
            <div className="status-card zone-alert">
              <div className="card-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="card-content">
                <h4>Zone Alert</h4>
                <span className="zone-type">School Zone</span>
                <span className="zone-limit">Speed Limit: 25 km/h</span>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="map-container">
            <div className="map-header">
              <h3>Route Tracking</h3>
              <div className="map-controls">
                <button className="map-btn">
                  <i className="fas fa-crosshairs"></i> Center
                </button>
                <button className="map-btn">
                  <i className="fas fa-traffic-light"></i> Traffic
                </button>
                <button className="map-btn">
                  <i className="fas fa-satellite"></i> Satellite
                </button>
              </div>
            </div>
            <div ref={mapRef} className="map"></div>
          </div>

          {/* Recent Activities */}
          <div className="activities-section">
            <h3>Recent Activities</h3>
            <div className="activities-list">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    <i className={activity.icon}></i>
                  </div>
                  <div className="activity-content">
                    <span className="activity-title">{activity.title}</span>
                    <span className="activity-details">{activity.details}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Notifications Container */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 
                                notification.type === 'warning' ? 'fa-exclamation-triangle' :
                                notification.type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}`}></i>
            <span>{notification.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverDashboard;
