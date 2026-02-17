'use client';
import useScreenWidth from '@/hooks/useScreenWidth';
import { Heart, Share } from 'lucide-react';

interface ImageSectionProps {
  images: string[];
  title?: string;
  propertyType?: string;
  location?: string;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
}

import ImageComponent from '../../image/imageComponent';

export default function ImageSection({
  images,
  title,
  propertyType,
  location,
  guests,
  bedrooms,
  beds,
  bathrooms,
}: ImageSectionProps) {
  const { width } = useScreenWidth();
  const isMobile = width !== null && width < 770;

  console.log('ImageSection Props:', guests, bedrooms, beds, bathrooms);

  if (isMobile) {
    // 📱 Mobile Carousel
    return (
      <div className=" space-y-4">
        {/* <h1 className="text-2xl font-semibold">
                    Earthy Escapes - 1BHK couple friendly near HSR/Harlur
                </h1> */}

        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar relative">
          {images.map((src, index) => (
            <div key={index} className="min-w-full snap-start flex-shrink-0">
              <ImageComponent
                src={src}
                alt={`Room ${index}`}
                width={800}
                height={800}
                className="w-full h-96 object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center text-center p-5 gap-4">
          <h1 className="text-2xl font-semibold">{title || 'Unknown'}</h1>
          <div>
            <p className="text-gray-500">
              {propertyType || ''} in {location || ''}
            </p>
            <p className="text-gray-500">
              {guests || 0} {guests && guests > 1 ? 'adults' : 'adult'} &#183;{' '}
              {bedrooms || 0}{' '}
              {bedrooms && bedrooms > 1 ? 'bedrooms' : 'bedroom'} &#183;{' '}
              {beds || 0} {beds && beds > 1 ? 'beds' : 'bed'} &#183;{' '}
              {bathrooms || 0}{' '}
              {bathrooms && bathrooms > 1 ? 'bathrooms' : 'bathroom'}
            </p>
          </div>
          {/* <div className="flex flex-wrap items-center justify-center space-x-6 py-4">
            <div className="text-center">
              <div className="text-lg font-semibold">5.0</div>
              <div className="text-sm text-gray-700">★★★★★</div>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            <div className="text-center">
              <div className="text-lg">
                <span className="mx-1 font-semibold">Guest</span>
                <span className="font-semibold">favourite</span>
              </div>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            <div className="text-center">
              <div className="text-lg font-semibold">31</div>
              <div className="text-sm text-gray-700">Reviews</div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  // 💻 Desktop Grid
  return (
    <div className=" mt-4 space-y-4 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-1xl font-semibold">{title || 'Unknown'}</h1>
        <div className="flex gap-4">
          <div className="flex gap-2 items-center underline cursor-pointer text-[13px]">
            <Share className="w-[15px] h-[15px]" />
            share
          </div>
          <div className="flex gap-2 items-center underline cursor-pointer text-[13px]">
            <Heart className="w-[15px] h-[15px]" />
            Save
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 overflow-hidden rounded-xl h-[560px]">
        {images.map((src, index) => {
          if (index === 0) {
            return (
              <div
                key={index}
                className={`${images.length === 1 ? 'md:col-span-4 row-span-4' : 'md:col-span-2 row-span-2'} rounded-tl-xl rounded-bl-xl overflow-hidden`}
              >
                <ImageComponent
                  src={src}
                  alt={`Room ${index}`}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          } else if (index === images.length - 1) {
            return (
              <div
                key={index}
                className={`${images.length === 3 ? '' : 'md:col-span-2 row-span-2'} rounded-br-xl overflow-hidden`}
              >
                <ImageComponent
                  src={src}
                  width={800}
                  height={800}
                  alt={`Room ${index}`}
                  className="w-full h-full object-cover"
                />
                {/* <Button className="absolute bottom-2 right-2  text-sm px-3 py-1 rounded-md shadow">
                  Show all photos
                </Button> */}
              </div>
            );
          }

          return (
            <ImageComponent
              key={index}
              src={src}
              alt={`Room ${index}`}
              width={800}
              height={800}
              className={`w-full h-full object-cover `}
            />
          );
        })}
      </div>
      <h1 className="text-[20px] font-semibold m-0">
        {propertyType || ''} in {location || ''}
      </h1>
      <p className="text-[16px]">
        {guests || 0} {guests && guests > 1 ? 'adults' : 'adult'} &#183;{' '}
        {bedrooms || 0} {bedrooms && bedrooms > 1 ? 'bedrooms' : 'bedroom'}{' '}
        &#183; {beds || 0} {beds && beds > 1 ? 'beds' : 'bed'} &#183;{' '}
        {bathrooms || 0} {bathrooms && bathrooms > 1 ? 'bathrooms' : 'bathroom'}
      </p>
      {/* <div className="flex items-center gap-4 p-4 rounded-xl border shadow-sm max-w-xl bg-white"> */}
      {/* Left Icon & Text */}
      {/* <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-gray-800 text-center">
            Guest <br /> favourite
          </div>
        </div> */}

      {/* Center Description */}
      {/* <div className="text-sm text-gray-700 font-medium">
          One of the most loved homes on StaygenX, according to guests
        </div> */}

      {/* Right Rating and Reviews */}
      {/* <div className="flex items-center gap-4 ml-auto">
          <div className="text-center">
            <div className="text-lg font-semibold">5.0</div>
            <div className="flex justify-end text-[#000]">★★★★★</div>
          </div>

          <div className="w-px h-8 bg-gray-300" />

          <div className="text-center">
            <div className="text-lg font-semibold">31</div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
        </div> */}
    </div>
    // </div>
  );
}
