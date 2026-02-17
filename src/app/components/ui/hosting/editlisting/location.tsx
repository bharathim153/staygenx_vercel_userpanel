'use client';

import { useGlobalStore } from '@/lib/store/global-store';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useListingStore } from '../../create-listings/store';
import { fetchAddress } from '@/utils/helper';
import { AddressFields } from '@/app/components/header/searchbarcomponents/autocomplete';
import { useCreateListingApi } from '../../create-listings/store/api';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import ThreeDotLoader from '@/app/components/threedotLoader';
import { ChevronRight } from 'lucide-react';
import EditLocation from './editlocation';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '18px',
};
const mapOptions = {
  disableDefaultUI: true, // hides all default controls (zoom buttons, etc.)
  clickableIcons: false, // hides POI icons
};
export default function Location() {
  const { GooglemapLoader } = useGlobalStore();
  const { setListingEdit } = useGlobalStore();
  const { ListingData, SetListingData } = useListingStore();
  const { CreateListing } = useCreateListingApi();

  const { trigger, isPending } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      if (data) {
        SetListingData({
          ...ListingData,
          location: {
            lat: data?.data?.lat as number,
            lng: data?.data?.lng as number,
            address: data?.data?.address as string,
            country: data?.data?.country as string,
            landmark: data?.data?.landmark as string,
            district: data?.data?.district as string,
            city: data?.data?.city as string,
            state: data?.data?.state as string,
            pincode: data?.data?.pincode as string,
            street: data?.data?.street as string,
          },
        });
      }
    },
  });

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();

    if (lat && lng) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const placeId = results[0].place_id;

          (async () => {
            try {
              const address: AddressFields = await fetchAddress(placeId);
              if (address) {
                const data: Partial<{ listingId: string }> = {};
                if (ListingData?.listingId) {
                  data.listingId = ListingData?.listingId;
                }
                trigger({
                  data,
                  step: 4,
                  isEdit: true,
                  editdata: {
                    ...address,
                  },
                });
              }
            } catch (error) {
              console.error('Failed to fetch address from place_id:', error);
            }
          })();
        } else {
          console.error('Geocoder failed: ', status);
        }
      });
    }
  };

  return (
    <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6">
      <p className="capitalize text-[32px] font-semibold">Location</p>
      {GooglemapLoader ? (
        <div className=" relative">
          <div className="absolute top-[50%] right-[50%] z-[999]">
            {isPending && <ThreeDotLoader />}
          </div>
          <div className={`w-full h-80 ${isPending ? 'opacity-50' : ''}`}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{
                lat: ListingData?.location?.lat ?? 0,
                lng: ListingData?.location?.lng ?? 0,
              }}
              zoom={10}
              options={mapOptions}
            >
              {(ListingData?.location?.lat !== 0 ||
                ListingData?.location?.lng !== 0) && (
                <Marker
                  position={{
                    lat: ListingData?.location?.lat ?? 0,
                    lng: ListingData?.location?.lng ?? 0,
                  }}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div
        className={`flex justify-between items-center p-4 rounded-lg cursor-pointer hover:bg-gray-50 `}
        onClick={() =>
          setListingEdit({ isEdit: true, content: <EditLocation /> })
        }
      >
        <div>
          <h2 className="text-[15px] font-medium text-gray-800">{'Address'}</h2>
          <p className="text-sm text-gray-500">
            {ListingData?.location?.address ?? ''}
          </p>
        </div>
        <ChevronRight className="text-gray-400" size={20} />
      </div>
    </section>
  );
}
