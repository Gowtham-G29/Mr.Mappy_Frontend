/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// icon for current location
const customIcon2 = new L.Icon({
  iconUrl: "https://img.icons8.com/?size=100&id=13800&format=png&color=000000",
  iconSize: [30, 50],
  iconAnchor: [12, 41], // need to identify what is this
});

const MapComponent = ({
  handleMapClick,
  storedMarker,
  markerVisible,
  onCurrentPositionFocus,
  navigateButton,
  setNavigateButton,
}) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  // Reference to map instance
  const mapRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          setMarkers((prevMarkers) => [
            ...prevMarkers,
            {
              geocode: [latitude, longitude],
              popUp: "You are here ,Lets mark!",
            },
          ]);
        },
        (error) => {
          alert(error.message);
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // Method to focus on current position

  const focusCurrentPosition = useCallback(() => {
    if (mapRef.current && currentPosition) {
      mapRef.current.setView(currentPosition, 15); // Focus on current position
    }
  }, [currentPosition]);

  useEffect(() => {
    if (onCurrentPositionFocus) {
      onCurrentPositionFocus(focusCurrentPosition);
    }
  }, [onCurrentPositionFocus, focusCurrentPosition]);

  useEffect(() => {
    if (navigateButton) {
      focusCurrentPosition();
      // Optionally reset the navigation button state after focusing
      setNavigateButton(false);
    }
  }, [focusCurrentPosition, navigateButton, setNavigateButton]);

  const MapClickHandler = () => {
    const map = useMap();
    mapRef.current = map; // Store map instance in the ref
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng); // Send the coordinates back to the parent component

        setMarkers((prevMarkers) => [
          ...prevMarkers,
          {
            geocode: [e.latlng.lat, e.latlng.lng],
            popUp: "Latest Activity",
          },
        ]);
      },
    });

    return null;
  };

  if (!currentPosition) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={currentPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[...currentPosition]}
            icon={customIcon2}
          >
            <div>
              <Popup>{marker.popUp}</Popup>
            </div>
          </Marker>
        ))}

        {/* submitted markers */}

        {markerVisible &&
          markers.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={customIcon}>
              <div>
                <Popup>{marker.popUp}</Popup>
              </div>
            </Marker>
          ))}
        {/* Previous stored markers */}
        {storedMarker.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.lat, marker.lng]}
            icon={customIcon}
          >
            <Popup>
              {marker.type}{" on "}
              {new Date(marker.activity_time).toLocaleDateString()}{" || "}
              {new Date(marker.activity_time).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}

        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
