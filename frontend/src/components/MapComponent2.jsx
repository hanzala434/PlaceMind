import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Default Leaflet Icons with Custom Colors
const currentLocationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  className: 'current-location-icon',
});

const selectedLocationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  className: 'selected-location-icon',
});

// CSS for Custom Colors
const styles = `
  .leaflet-marker-icon.current-location-icon {
    filter: hue-rotate(200deg); /* Blue */
  }
  .leaflet-marker-icon.selected-location-icon {
    filter: hue-rotate(100deg); /* Green */
  }
`;

const SetMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapComponent2 = ({ onLocationUpdate }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Add dynamic styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];
          setCurrentLocation(location);
          // if (onLocationUpdate) {
          //   onLocationUpdate({ lat: latitude, lng: longitude });
          // }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Cleanup style element
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [onLocationUpdate]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const location = {lat, lng};
        setSelectedLocation(location);
    if (onLocationUpdate) {
  console.log('Selected Location:', location);
  onLocationUpdate(location);
}
      },
    });
    return null;
  };

  return (
    <div>
      <MapContainer
        center={currentLocation || [51.505, -0.09]} // Default center while location is loading
        zoom={13}
        style={{ height: '300px', width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {currentLocation && <SetMapCenter center={currentLocation} />}
        <MapClickHandler />
        {/* Marker for Current Location */}
        {currentLocation && (
          <Marker position={currentLocation} icon={currentLocationIcon} />
        )}
        {/* Marker for Selected Location */}
        {selectedLocation && (
          <Marker position={selectedLocation} icon={selectedLocationIcon} />
        )}
      </MapContainer>
      {selectedLocation && (
        <p className="mt-2 text-sm text-gray-600">
          Selected Location: Latitude: {selectedLocation[0]}, Longitude: {selectedLocation[1]}
        </p>
      )}
    </div>
  );
};

export default MapComponent2;
