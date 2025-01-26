import React, { useRef, useEffect } from 'react';
import { Map, Marker } from 'react-bkoi-gl'; // Import the Barikoi React GL package
import 'react-bkoi-gl/styles'; // Import CSS for proper map styling

const MapComponent = ({ markerCoordinates }) => {
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  if (!apiKey) {
    console.error('API key is missing! Please add it to your .env.local file.');
    return;
  }
  const mapStyle = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${apiKey}`;
  const mapRef = useRef(null);

  const initialViewState = {
    longitude: 90.36402,
    latitude: 23.823731,
    minZoom: 4,
    maxZoom: 30,
    zoom: 13,
    bearing: 0,
    pitch: 0,
    antialias: true,
  };

  useEffect(() => {
    if (markerCoordinates) {
      // Fly to the new coordinates when markerCoordinates is updated
      mapRef.current.flyTo({
        center: [markerCoordinates.longitude, markerCoordinates.latitude],
        essential: true, // Ensures the flyTo is not affected by user interactions
        zoom: 14, // Adjust zoom level as needed
        speed: 0.8, // Animation speed (0 = immediate, 1 = normal)
        curve: 1, // Smoothness of the animation
        easing: (t) => t, // Easing function for the animation
      });
    }
  }, [markerCoordinates]); // This effect runs whenever markerCoordinates change

  return (
    <div ref={mapRef} style={containerStyles}>
      <Map
        ref={mapRef}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        initialViewState={initialViewState}
        doubleClickZoom={false}
        dragRotate={false}
        attributionControl={true}
      >
        {markerCoordinates && (
          <Marker
            longitude={markerCoordinates.longitude}
            latitude={markerCoordinates.latitude}
            anchor="bottom"
          >
            {/* Add marker icon or any custom content */}
          </Marker>
        )}
      </Map>
    </div>
  );
};

// JSX Styles
const containerStyles = {
  width: '100%',
  height: '98vh',
  minHeight: '400px',
  overflow: 'hidden',
};

export default MapComponent;
