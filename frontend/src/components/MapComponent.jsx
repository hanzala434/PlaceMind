import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import L from 'leaflet';
import { useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ tasks }) => {
  const mapRef = useRef(null); // Map container
  const userMarker = useRef(null); // Current user's marker
  const taskMarkers = useRef({}); // Store task markers by task ID
  const taskCircles = useRef({}); // Store circles by task ID
  const socket = useRef(null); // Socket instance
  const { user } = useSelector((state) => state.auth);

  const customIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [32, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const getLocation = (centerMap = false) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Device Coordinates:', { latitude, longitude });

          if (centerMap && mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
          }

          if (mapRef.current) {
            if (userMarker.current) {
              // Update user's marker position
              userMarker.current.setLatLng([latitude, longitude]);
            } else {
              // Add a new marker for the user
              userMarker.current = L.marker([latitude, longitude], {
                icon: customIcon,
              })
                .addTo(mapRef.current)
                .bindPopup(`<b>Your Location</b>`);
            }
          }

          // Send user's location to the backend
          if (socket.current) {
            socket.current.emit('register-user', user._id);
            socket.current.emit('send-location', {
              latitude,
              longitude,
              phone: `${user.phone}`, // Replace with actual user's phone number
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    try {
      if (!mapRef.current) {
        const map = L.map('map').setView([0, 0], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Place Mind',
        }).addTo(map);
        mapRef.current = map;

        // Center map on the user's location on page load
        getLocation(true);
      }
    } catch (error) {
      console.error('Error initializing Leaflet map:', error);
    }

    // Initialize socket connection
    try {
      socket.current = io(process.env.REACT_APP_API, {
        transports: ['websocket', 'polling'],
      });

      // Trigger location fetch every 5 seconds
      const locationInterval = setInterval(getLocation, 5000);

      // Add markers for tasks
      tasks.forEach((task) => {
        const { location, title, _id, radius } = task;
        if (location && location.lat && location.lng) {
          const { lat, lng } = location;

          // Check if a marker already exists for this task
          if (!taskMarkers.current[_id]) {
            taskMarkers.current[_id] = L.marker([lat, lng], {
              icon: customIcon,
            })
              .addTo(mapRef.current)
              .bindPopup(`<b>${title}</b>`);
          } else {
            taskMarkers.current[_id].setLatLng([lat, lng]);
          }

          if (!taskCircles.current[_id]) {
            taskCircles.current[_id] = L.circle([lat, lng], {
              radius: radius || 500,
              color: 'blue',
              fillColor: '#3388ff',
              fillOpacity: 0.2,
            }).addTo(mapRef.current);
          } else {
            taskCircles.current[_id]
              .setLatLng([lat, lng])
              .setRadius(radius || 500);
          }
        }
      });

      // Cleanup on component unmount
      return () => {
        Object.values(taskMarkers.current).forEach((marker) => {
          mapRef.current.removeLayer(marker);
        });
        Object.values(taskCircles.current).forEach((circle) => {
          mapRef.current.removeLayer(circle);
        });
        taskMarkers.current = {};
        taskCircles.current = {};
        if (userMarker.current) {
          mapRef.current.removeLayer(userMarker.current);
          userMarker.current = null;
        }
        clearInterval(locationInterval);
        socket.current.disconnect();
      };
    } catch (error) {
      console.error('Error with socket.io:', error);
    }
  }, [tasks]);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default MapComponent;
