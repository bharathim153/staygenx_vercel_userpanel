'use client';

import Button from '@/shadcn/ui/Button';
import { useContext } from 'react';
import { useListingStore } from './store';
import PageContext from '../../contextprovider';

type FloorType =
  | 'bedrooms'
  | 'beds'
  | 'bathrooms'
  | 'adults'
  | 'children'
  | 'infants';

interface FloorItem {
  label: string;
  type: FloorType;
}
const initial = {
  adults: 1,
  children: 0,
  infants: 0,
  bedrooms: 2,
  beds: 2,
  bathrooms: 1,
  pets: false,
};
const FloosrItems: FloorItem[] = [
  // { label: 'Adults', type: 'adults' },
  // { label: 'Children', type: 'children' },
  // { label: 'Infants', type: 'infants' },
  { label: 'Bedrooms', type: 'bedrooms' },
  { label: 'Beds', type: 'beds' },
  { label: 'Bathrooms', type: 'bathrooms' },
];

export default function FloorPlan() {
  const { SetListingData, ListingData } = useListingStore();
  const { i18 } = useContext(PageContext);

  const floorplan =
    typeof i18?.CREATELISTING?.FLOORPLAN === 'object'
      ? i18.CREATELISTING.FLOORPLAN
      : {};

  const updateCount = (type: FloorType, delta: number) => {
    SetListingData(prev => ({
      floorplan: {
        ...prev.floorplan,
        [type]: Math.max(0, (prev.floorplan?.[type] ?? 0) + delta),
      },
    }));
  };
  return (
    <div className="max-w-[630px] mx-auto flex flex-col items-start">
      <h1 className="text-[30px] md:text-[32px] font-bold mt-4 text-start">
        {(typeof floorplan?.HEADER === 'string' && floorplan?.HEADER) ||
          'Share some basics about your place'}
      </h1>
      <div className="text-[18px] text-gray-500 mb-8 text-start">
        {(typeof floorplan?.DESC === 'string' && floorplan?.DESC) ||
          "You'll add more details later, such as bed types."}
      </div>
      {FloosrItems.map(item => (
        <div
          key={item.type}
          className={`flex justify-between items-center w-full border-b py-4`}
        >
          <div>
            <div className="text-base font-medium text-start my-4">
              {item.label}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => updateCount(item.type, -1)}
              className="w-8 h-8 rounded-full border border-gray-600 text-gray-500 text-xl leading-none disabled:opacity-30 cursor-pointer"
              disabled={
                initial[item?.type] ===
                (ListingData?.floorplan && ListingData?.floorplan[item?.type])
              }
            >
              −
            </Button>
            <span className="text-base">
              {ListingData?.floorplan ? ListingData?.floorplan[item.type] : 0}
            </span>
            <Button
              onClick={() => updateCount(item.type, 1)}
              className="w-8 h-8 rounded-full border border-gray-600 text-gray-500 text-xl leading-none cursor-pointer"
            >
              +
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center w-full  py-4">
        <div className="text-base font-medium text-start my-4">Pets</div>

        {/* Toggle */}
        <div
          onClick={() =>
            SetListingData(prev => ({
              ...prev,
              floorplan: {
                ...prev.floorplan,
                pets: !prev.floorplan?.pets,
              },
            }))
          }
          className={`relative w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            ListingData.floorplan?.pets ? 'bg-[#FF385C]' : 'bg-gray-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
              ListingData.floorplan?.pets ? 'translate-x-5' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
}
