'use client';

import React from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '18px',
};

// Default center, will be overridden if valid lat/lng are provided
const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};
const mapOptions = {
  disableDefaultUI: true, // hides all default controls (zoom buttons, etc.)
  clickableIcons: false, // hides POI icons
  gestureHandling: 'none', // disables zooming by scroll/touch gestures
  scrollwheel: false, // extra safety: disables scroll zoom
  disableDoubleClickZoom: true, // disables double-click zoom
  zoomControl: false, // ensure zoom control buttons are off
};

import type { AddressFields } from '@/app/components/header/searchbarcomponents/autocomplete';

export default function MapComponent({
  data,
}: {
  data: AddressFields | Record<string, unknown>;
}) {
  // Prefer nested location object if present
  const locationObj = data || {};
  const lat =
    typeof locationObj.lat === 'number'
      ? locationObj.lat
      : Number(locationObj.lat);
  const lng =
    typeof locationObj.lng === 'number'
      ? locationObj.lng
      : Number(locationObj.lng);
  const hasLocation = !isNaN(lat) && !isNaN(lng) && !!locationObj.address;

  console.log('MapData:', data, lat, lng);

  // Center the map on the marker if location is valid

  // Defensive: always ensure numbers for map center
  const mapCenter = hasLocation ? { lat, lng } : defaultCenter;

  return (
    <div className="py-6 px-5 border-b">
      <h2 className="text-xl font-semibold mb-6">Where you’ll be</h2>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_MAP_API_KEY || ''}
        libraries={['places']}
      >
        <div className="w-full h-96">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={15}
            options={mapOptions}
          >
            {hasLocation && !isNaN(mapCenter.lat) && !isNaN(mapCenter.lng) ? (
              <Marker position={mapCenter} />
            ) : null}
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
}
