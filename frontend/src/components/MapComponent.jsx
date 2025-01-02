import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import L from 'leaflet';
import { useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';


const MapComponent = ({tasks}) => {
    const mapRef = useRef(null); // Map container
    const markers = useRef({}); // Store markers by user ID
    const socket = useRef(null); // Socket instance
    const taskMarkers = useRef({}); // Store task markers by task ID
    const taskCircles = useRef({}); // Store circles by task ID
    const {user}=useSelector((state)=>state.auth)

    // console.log(user._id);

    const markerColors = [
        'red',
        'blue',
        'green',
        'purple',
        'orange',
        'yellow',
      ];

    const customIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [32, 40], // Size of the icon [width, height]
        iconAnchor: [16, 32], // Anchor point of the icon (base of the pin)
        popupAnchor: [0, -32], // Where the popup opens relative to the anchor
    });

    const createCustomIcon = (color) =>
        L.icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
          iconSize: [32, 40],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
    
    // Function to get the current location
    const getLocation = (centerMap = false) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log("Device Coordinates:", { latitude, longitude }); // Logs the coordinates
      
              if (centerMap && mapRef.current) {
                mapRef.current.setView([latitude, longitude], 13); // Adjust zoom level as needed
              }
      
              if (socket.current) {
                socket.current.emit("register-user", user._id);
                socket.current.emit("send-location", { 
                  latitude, 
                  longitude, 
                  phone: `${user.phone}` // Replace with actual user's phone number 
                });
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      };
      

    useEffect(() => {
        try {

            // Check if map is already initialized
            if (!mapRef.current) {
                const map = L.map('map').setView([0, 0], 10);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "Place Mind",
                }).addTo(map);
                mapRef.current = map; // Assign map instance to ref
    
                // Center map on the user's location on page load
                getLocation(true);

            // Initialize the map
            if (!mapRef.current) {
            const map = L.map('map').setView([0, 0], 10);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "Place Mind",
            }).addTo(map);
            mapRef.current = map; // Assign map instance to ref
            // Center map on the user's location on page load
            getLocation(true);
          }
            }
        } catch (error) {
            console.error("Error initializing Leaflet map:", error);
        }

        // Initialize socket connection
        try {
            socket.current = io(process.env.REACT_APP_API); // Update with your backend URL
            socket.current = io(process.env.REACT_APP_API, {
              transports: ["websocket", "polling"]}); // Update with your backend URL

            // Trigger location fetch every 5 seconds
            const locationInterval = setInterval(getLocation, 5000);

            // Listen for location updates
            socket.current.on("receive-location", (data) => {
                const { id, latitude, longitude } = data;

                if (mapRef.current) {
                    if (markers.current[id]) {
                        markers.current[id].setLatLng([latitude, longitude],{ icon: customIcon });
                    } else {
                        markers.current[id] = L.marker([latitude, longitude],{ icon: customIcon }).addTo(mapRef.current);
                    }
                }
            });

            // Remove marker on user disconnect
            socket.current.on("user-disconnected", (id) => {
                if (markers.current[id]) {
                    mapRef.current.removeLayer(markers.current[id]);
                    delete markers.current[id];
                }
            });

            // Add markers for tasks
            tasks.forEach((task) => {
                const { location, title, _id ,radius} = task;
                // Check if location object exists and contains valid lat and lng properties
                if (location && location.lat && location.lng) {
                  const { lat, lng } = location; // Destructure lat and lng from location
                //   const color = markerColors[index % markerColors.length]; // Cycle through marker colors
              
                  // Check if a marker already exists for this task
                  if (!taskMarkers.current[_id]) {
                    // Create and store a new marker for the task
                    taskMarkers.current[_id] = L.marker([lat, lng], {
                      icon: customIcon, // Use a custom icon with specific color
                    })

                      .addTo(mapRef.current)
                      .bindPopup(`<b>${title}</b>`); // Bind popup with task title
                  } else {
                    // Update the marker's position if it already exists
                    taskMarkers.current[_id].setLatLng([lat, lng]);
                  }
                  if (!taskCircles.current[_id]) {
                    taskCircles.current[_id] = L.circle([lat, lng], {
                        radius: radius || 500, // Default radius if not provided
                        color: 'blue',
                        fillColor: '#3388ff',
                        fillOpacity: 0.2,
                    }).addTo(mapRef.current);
                } else {
                    taskCircles.current[_id].setLatLng([lat, lng]).setRadius(radius || 500);
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
                taskMarkers.current = {}; // Clear markers reference
                taskCircles.current = {};

            };
        } catch (error) {
            console.error("Error with socket.io:", error);
        }
    }, [tasks]);

    return (
        <div>
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
        </div>
    );
};

export default MapComponent;
