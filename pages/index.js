import { useState } from 'react';
import Autocomplete from '../components/Autocomplete';
import MapComponent from '../components/MapComponent';
// import styles from './Home.module.css'; // Import the CSS module for layout

export default function Home() {
  const [markerCoordinates, setMarkerCoordinates] = useState(null);

  const handleSelectPlace = (place) => {
    // Extract latitude and longitude from the selected place
    const { latitude, longitude } = place;
    setMarkerCoordinates({ latitude, longitude });
  };

  return (
    <div className="container">
      <div className="autocompleteContainer">
        <Autocomplete onSelect={handleSelectPlace} />
      </div>
      <MapComponent markerCoordinates={markerCoordinates} />
    </div>
  );
}
