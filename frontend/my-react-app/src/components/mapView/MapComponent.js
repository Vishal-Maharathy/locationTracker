import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [usersAround, setUsersAround] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Fetch user locations around the current location
        const response = await axios.get('http://localhost:4000/location/getUsersAround', {
          params: {
            userId: 'vishal',
            range: 10, // specify the range in kilometers
          },
        });
        const data = response.data.locations;
        setUsersAround(data);

        // Fetch user's own location
        const userPosition = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        });

        setUserLocation({ latitude: userPosition.latitude, longitude: userPosition.longitude });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user locations:', error);
      }
    };

    fetchLocations();
    const intervalId = setInterval(fetchLocations, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const userIcon = new Icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/order-delivered.png',
    iconSize: [38, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  });

  const renderUserMarkers = () => {
    return usersAround.map((user) => (
      <Marker key={user.userId} position={[user.latitude, user.longitude]} icon={userIcon}>
        <Popup>{user.username}</Popup>
      </Marker>
    ));
  };

  return (
    loading ? (
      <>Loading</>
    ) : (
      <MapContainer
        style={{ width: '100%', height: '90vh' }}
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={9}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>Your Device</Popup>
        </Marker>
        {renderUserMarkers()}
      </MapContainer>
    )
  );
};

export default MapView;









// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { Icon } from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import '../../assets/mapView/mapContainer.css';

// const MapView = () => {
//   const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
//   const [targetLocation, setTargetLocation] = useState({ latitude: 0, longitude: 0 });
//   const [direction, setDirection] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       console.log("Fetching....")
//       try {
//         const response = await axios.get('http://localhost:4000/location/getLocation', {
//           params: {
//             userId: 'vishal'
//           }
//         });
//         const data = response.data.location;
//         setTargetLocation(data);
//         calculateDirection();

//         const getUserPosition = () => {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               const { latitude, longitude } = position.coords;
//               setUserLocation({ latitude, longitude });
//               setLoading(false); // Set loading to false once user location is fetched
//             },
//             (error) => {
//               console.error('Error getting user location:', error.message);
//             }
//           );
//         };
//         getUserPosition();
//       } catch (error) {
//         console.error('Error fetching target location:', error);
//       }
//     };

//     fetchLocations();
//     const intervalId = setInterval(fetchLocations, 2000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   const calculateDirection = () => {
//     const userLat = userLocation.latitude;
//     const userLng = userLocation.longitude;
//     const targetLat = targetLocation.latitude;
//     const targetLng = targetLocation.longitude;

//     const radianToDegree = (radian) => (radian * 180) / Math.PI;

//     const dLng = targetLng - userLng;
//     const x = Math.cos(targetLat) * Math.sin(dLng);
//     const y = Math.cos(userLat) * Math.sin(targetLat) - Math.sin(userLat) * Math.cos(targetLat) * Math.cos(dLng);
//     const bearing = radianToDegree(Math.atan2(x, y));

//     setDirection(bearing);
//   };
//   //set new icon for the marker
//   const homeIcon = new Icon({
//     iconUrl: 'https://img.icons8.com/ios-filled/50/order-delivered.png',
//     iconSize: [38, 38], // size of the icon
//     iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//     popupAnchor: [-3, -76]
//   });
//   const targetIcon = new Icon({
//     iconUrl: 'https://img.icons8.com/ios-filled/50/map-pin.png',
//     iconSize: [38, 38], // size of the icon
//     iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//     popupAnchor: [-3, -76]
//   });
//   return (
//     loading?<>Loading</>:(
//       <MapContainer
//         style={{ width: '100%', height: '90vh' }}
//         center={[userLocation.latitude, userLocation.longitude]}
//         zoom={9}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <Marker position={[userLocation.latitude, userLocation.longitude]} icon={homeIcon}>
//           <Popup>Your Device</Popup>
//         </Marker>
//         <Marker position={[targetLocation.latitude, targetLocation.longitude]} icon={targetIcon}>
//           <Popup>Target Device</Popup>
//         </Marker>
//         {direction !== null && (
//           <Marker position={[userLocation.latitude, userLocation.longitude]} rotationAngle={direction} rotationOrigin="center" icon={homeIcon}>
//             <Popup>Direction to Target</Popup>
//           </Marker>
//         )}
//       </MapContainer>
//     )
//   );
// };

// export default MapView;
