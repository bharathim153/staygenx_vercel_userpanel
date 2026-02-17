import { ArrowLeft, Heart, Share } from 'lucide-react';
import AmenitiesSection from './amenitiesSection';

import HostProfile from './hostProfile';
import HostSection from './hostSection';
import ImageSection from './imagesection';
import MapComponent from './mapSection';
import GuestRatingSummary from './ratings';
import Reservation from './reservation';
import ReviewList from './reviewSection';
import ScrollSpyNav from './scrollspyNav';
import ThingsToKnow from './thingstoknow';
import CalendarSection from './calendarSection';

interface RoomsPageProps {
  data: Record<string, unknown>;
}

export default function RoomsPage({ data }: RoomsPageProps) {
  const roomData = data as Record<string, unknown>;

  console.log('RoomData:', roomData);
  // Type assertions and fallback values for all props
  const images = Array.isArray(roomData.images)
    ? (roomData.images as string[])
    : [];
  const title = typeof roomData.title === 'string' ? roomData.title : undefined;
  const propertyType =
    typeof roomData.propertyType === 'object' &&
      roomData.propertyType &&
      'name' in roomData.propertyType
      ? (roomData.propertyType as { name?: string }).name
      : undefined;
  const location =
    typeof roomData.address === 'string' ? roomData.address : undefined;
  const guests =
    typeof roomData.adults === 'number' ? roomData.adults : undefined;
  // const guests =
  //   typeof roomData.totalGuests === 'number' ? roomData.totalGuests : undefined;

  const bedrooms =
    typeof roomData.bedrooms === 'number' ? roomData.bedrooms : undefined;
  const beds = typeof roomData.beds === 'number' ? roomData.beds : undefined;
  const bathrooms =
    typeof roomData.bathrooms === 'number' ? roomData.bathrooms : undefined;
  const host = roomData.userId as import('./hostSection').User | undefined;
  console.log('Host in RoomsPage:', host);
  const desc =
    typeof roomData.description === 'string' ? roomData.description : undefined;
  const cancellationPolicy =
    typeof roomData.cancellationPolicy === 'string'
      ? roomData.cancellationPolicy
      : undefined;
  const hasCarbonMonoxideAlarm =
    typeof roomData.hasCarbonMonoxideAlarm === 'boolean'
      ? roomData.hasCarbonMonoxideAlarm
      : undefined;
  const hasSmokeAlarm =
    typeof roomData.hasSmokeAlarm === 'boolean'
      ? roomData.hasSmokeAlarm
      : undefined;
  const hasFireExtinguisher =
    typeof roomData.hasFireExtinguisher === 'boolean'
      ? roomData.hasFireExtinguisher
      : undefined;
  const hasFirstAidKit =
    typeof roomData.hasFirstAidKit === 'boolean'
      ? roomData.hasFirstAidKit
      : undefined;
  const listingId = typeof roomData._id === 'string' ? roomData._id : '';
  const weekdayBasePrice =
    typeof roomData.weekdayBasePrice === 'number'
      ? roomData.weekdayBasePrice
      : 0;

  return (
    <>
      <ScrollSpyNav weekdayBasePrice={weekdayBasePrice} listingId={listingId} />
      <div className="flex  p-5 justify-between w-full bg-white shadow-lg border-b md:hidden">
        <ArrowLeft size={15} />
        <div className="flex gap-5">
          <div className="">
            <Share size={15} />
          </div>
          <div className="">
            <Heart size={15} />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        <div id="photos">
          <ImageSection
            images={images}
            title={title}
            propertyType={propertyType}
            location={location}
            guests={guests}
            bedrooms={bedrooms}
            beds={beds}
            bathrooms={bathrooms}
          />
        </div>
        <div className="flex flex-col md:flex-row w-full gap-8">
          {/* Left Content */}
          <div className="w-full md:w-[60%] flex flex-col gap-6">
            {host && (
              <HostSection
                host={host}
                desc={desc}
                cancellationPolicy={cancellationPolicy}
                hasCarbonMonoxideAlarm={hasCarbonMonoxideAlarm}
                hasSmokeAlarm={hasSmokeAlarm}
                hasFireExtinguisher={hasFireExtinguisher}
                hasFirstAidKit={hasFirstAidKit}
              />
            )}
            <div id="amenities">
              <AmenitiesSection roomData={roomData} />
            </div>
            <CalendarSection roomData={roomData} />
          </div>

          {/* Sticky Reservation */}
          <div id="reservation" className="w-full md:w-[40%]">
            <div className="fixed w-full z-50 md:z-0 md:sticky bottom-0 md:top-24">
              <Reservation
                roomData={roomData}
                listingId={listingId}
                weekdayBasePrice={weekdayBasePrice}
              />
            </div>
          </div>
        </div>

        <div id="reviews">
          <GuestRatingSummary roomData={roomData} />
          <ReviewList roomData={roomData} />
        </div>

        <div id="location">
          <MapComponent data={roomData} />
        </div>

        {host && <HostProfile host={host} />}
        <ThingsToKnow />
      </div>
    </>
  );
}
