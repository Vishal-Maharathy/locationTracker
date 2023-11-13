import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [targetLocation, setTargetLocation] = useState({ latitude: 0, longitude: 0 });
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    // Fetch target location periodically
    const fetchLocations = async () => {
      try {
        //get device's location
        const response = await axios.get('http://localhost:4000/location/getLocation', {
            params: {
                userId: 'vishal'
            }
        });
        const data = response.data.location;
        setTargetLocation(data);
        calculateDirection();

        //get user's location
        const getUserPosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting user location:', error.message);
                }
            );
        };
        getUserPosition()
      } catch (error) {
        console.error('Error fetching target location:', error);
      }
    };

    // Fetch target location initially and then set up periodic fetching
    fetchLocations();
    const intervalId = setInterval(fetchLocations, 2000); // Adjust the interval as needed

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const calculateDirection = () => {
    // Calculate the direction between user and target locations
    const userLat = userLocation.latitude;
    const userLng = userLocation.longitude;
    const targetLat = targetLocation.latitude;
    const targetLng = targetLocation.longitude;

    const radianToDegree = (radian) => (radian * 180) / Math.PI;

    const dLng = targetLng - userLng;
    const x = Math.cos(targetLat) * Math.sin(dLng);
    const y = Math.cos(userLat) * Math.sin(targetLat) - Math.sin(userLat) * Math.cos(targetLat) * Math.cos(dLng);
    const bearing = radianToDegree(Math.atan2(x, y));

    setDirection(direction);
  };
  console.log("Direction", direction)
  return (
    <MapContainer
      style={{ width: '100%', height: '90vh' }}
      center={[userLocation.latitude, userLocation.longitude]}
      zoom={5}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[userLocation.latitude, userLocation.longitude]}>
        <Popup>Your Device</Popup>
      </Marker>
      <Marker position={[targetLocation.latitude, targetLocation.longitude]}>
        <Popup>Target Device</Popup>
      </Marker>
      {direction !== null && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} rotationAngle={direction} rotationOrigin="center">
          <Popup>Direction to Target</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapView;
