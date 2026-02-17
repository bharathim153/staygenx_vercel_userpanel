'use clinet';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { loadGoogleMapsScript } from '@/hooks/loadMapScript';
import { useGlobalStore } from '@/lib/store/global-store';
import UserProfile from '@/app/components/userProfile';
import PageContext from '@/app/components/contextprovider';
import { ListingData, useListingStore } from '../../../create-listings/store';
import { useCustomeQuery } from '@/hooks/useCustomeQuery';
import { AmenityApi } from '@/services/listing/getapis';

import Image from 'next/image';
import MapComponent from '../../../rooms/mapSection';

// const containerStyle = {
//   width: '100%',
//   height: '100%',
//   borderRadius: '18px',
// };
// const mapOptions = {
//   disableDefaultUI: true, // hides all default controls (zoom buttons, etc.)
//   clickableIcons: false, // hides POI icons
//   gestureHandling: 'none', // disables zooming by scroll/touch gestures
//   scrollwheel: false, // extra safety: disables scroll zoom
//   disableDoubleClickZoom: true, // disables double-click zoom
//   zoomControl: false, // ensure zoom control buttons are off
// };
export default function ContainerComp({
  title,
  path,
  extractedPathname,
  data,
}: {
  title: string;
  path: string;
  extractedPathname: string;
  data: ListingData;
}) {
  const Router = useRouter();
  const { GooglemapLoader } = useGlobalStore();
  const { i18 } = useContext(PageContext);
  const { ListingData } = useListingStore();
  const editlisting =
    typeof i18?.EDITLISTING === 'object' ? i18?.EDITLISTING : undefined;
  const { data: AmenityData } = useCustomeQuery(['amenity'], () =>
    AmenityApi()
  );
  const Amenities =
    Array.isArray(AmenityData) &&
    AmenityData.length > 0 &&
    AmenityData.filter(item =>
      data?.amenities?.amenities.includes(item._id)
    ).map(item => item);

  useEffect(() => {
    if (title === 'Location') {
      console.log('GooglemapLoader:', GooglemapLoader);
      if (!GooglemapLoader) loadGoogleMapsScript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GooglemapLoader]);

  return (
    <div
      onClick={() =>
        Router.push(
          `/hosting/listing/editor/${ListingData?.listingId}/details/${path}`
        )
      }
      className={`cursor-pointer bg-white rounded-xl ${extractedPathname === path ? 'border border-2 border-[#000]' : 'border'}  shadow-lg overflow-hidden flex flex-col hover:bg-gray-100 gap-2 p-4`}
    >
      <h3 className="text-[#000] font-[600]">{title}</h3>
      {title === 'Title' && (
        <h2 className="text-[26px] font-semibold text-[#202020DB] ">
          {data?.description?.title ?? ''}
        </h2>
      )}
      {title === 'Pricing' && (
        <div className="flex flex-col gap-1">
          <p className="text-[#202020DB]">
            ₹ {data?.baseprice?.weekday ?? ''}{' '}
            {(typeof editlisting?.PERNIGHT === 'string' &&
              editlisting?.PERNIGHT) ||
              'per night'}
          </p>
          <p className="text-[#202020DB]">
            ₹ {data?.baseprice?.weekend ?? ''}{' '}
            {(typeof editlisting?.WEEKENDPRICE === 'string' &&
              editlisting?.WEEKENDPRICE) ||
              ' weekend price'}
          </p>
        </div>
      )}
      {title === 'Number of guest' && (
        <div className="flex flex-col gap-1">
          <p className="text-[#202020DB]">
            {(data?.floorplan?.adults ?? 0) + (data?.floorplan?.children ?? 0)}{' '}
            {(data?.floorplan?.adults ?? 0) + (data?.floorplan?.children ?? 0) >
            1
              ? 'guests'
              : 'guest'}
          </p>
        </div>
      )}
      {title === 'Amenities' &&
        (Array.isArray(Amenities) && Amenities.length > 0 ? (
          Amenities.map(items => (
            <div key={items?._id} className="flex gap-2 items-center">
              <Image
                src={process.env.NEXT_PUBLIC_IMAGE_URL + items?.icon}
                alt="image"
                width={15}
                height={15}
              />
              <p className="text-[#202020DB]">{items?.name ?? ''}</p>
            </div>
          ))
        ) : (
          <p className="text-[#202020DB]">Add amenities</p>
        ))}

      {title === 'Description' && (
        <p className="text-[#202020DB]">
          {data?.description?.description ?? ''}
        </p>
      )}
      {title === 'Location' && (
        <div className="flex flex-col gap-4">
          {GooglemapLoader ? (
            <div className="w-full h-auto">
              <MapComponent data={data.location ?? {}} />
              {/* <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: data?.location?.lat ?? 0,
                  lng: data?.location?.lng ?? 0,
                }}
                zoom={10}
                options={mapOptions}
              >
                {(data?.lat !== 0 || data?.lng !== 0) && (
                  <Marker
                    position={{
                      lat: data?.location?.lat ?? 0,
                      lng: data?.location?.lng ?? 0,
                    }}
                  />
                )}
              </GoogleMap> */}
            </div>
          ) : (
            <p>loading...</p>
          )}

          <p className="text-[#202020DB]">{data?.location?.address ?? ''}</p>
        </div>
      )}
      {title === 'About the host' && (
        <div className="flex items-center justify-center">
          <UserProfile
            withname={true}
            className="w-[70px] h-[70px] text-[18px]"
          />
        </div>
      )}
      {/* {
                title === 'Property type' &&
                <p>{data?.propertyType ?? ''}</p>
            } */}
    </div>
  );
}
