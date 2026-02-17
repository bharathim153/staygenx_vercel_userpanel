import React from 'react';
import { GoogleMap } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '18px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

export default function MapComponent() {
  // const [map, setMap] = React.useState<google.maps.Map | null>(null);
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      // onLoad={mapInstance => setMap(mapInstance)}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  );
}
