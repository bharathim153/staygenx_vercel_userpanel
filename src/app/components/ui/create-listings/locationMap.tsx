'use client';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import Input from '../../header/searchbarcomponents/input';
import { MapPin } from 'lucide-react';
import AddressForm from './locationForm';
import { AddressFields } from '../../header/searchbarcomponents/autocomplete';
import { useListingStore } from './store';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '18px',
};

const mapOptions = {
  disableDefaultUI: true, // hides all default controls (zoom buttons, etc.)
  clickableIcons: false, // hides POI icons
  gestureHandling: 'none', // disables zooming by scroll/touch gestures
  scrollwheel: false, // extra safety: disables scroll zoom
  disableDoubleClickZoom: true, // disables double-click zoom
  zoomControl: false, // ensure zoom control buttons are off
};

export default function LocationMap() {
  const { SetListingData, ListingData } = useListingStore();
  const suggestion: AddressFields = ListingData?.location ?? {
    lat: 0,
    lng: 0,
  };

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: -3.745,
    lng: -38.523,
  });

  useEffect(() => {
    if (
      ListingData?.location &&
      typeof ListingData.location.lat === 'number' &&
      typeof ListingData.location.lng === 'number' &&
      !isNaN(ListingData.location.lat) &&
      !isNaN(ListingData.location.lng)
    ) {
      setCenter({
        lat: ListingData.location.lat,
        lng: ListingData.location.lng,
      });
    }
  }, [ListingData?.location]);

  const hasLocation =
    ListingData?.location &&
    typeof ListingData.location.lat === 'number' &&
    typeof ListingData.location.lng === 'number' &&
    !isNaN(ListingData.location.lat) &&
    !isNaN(ListingData.location.lng) &&
    !!ListingData.location.address;

  return (
    <>
      {hasLocation && <AddressForm suggestion={suggestion} />}
      <div className="relative h-96 w-full">
        {!hasLocation && (
          <>
            <div className="absolute top-[55px] left-13  z-50 ">
              <MapPin className="w-[25px] h-[25px]" />
            </div>
            <div className="absolute top-0 left-0 w-full max-w-2xl z-40 p-10">
              <Input
                autocomplete={true}
                onChange={suggestion => {
                  SetListingData({ location: suggestion });
                }}
                currentLocation={true}
                className="pl-12 pr-4 py-4 w-full bg-white rounded-full border border-gray-200 focus:border-black focus:ring-2 focus:ring-black outline-none transition"
              />
            </div>
          </>
        )}

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          options={mapOptions}
        >
          {hasLocation && (
            <Marker
              position={{
                lat: ListingData?.location?.lat ?? 0,
                lng: ListingData?.location?.lng ?? 0,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </>
  );
}
