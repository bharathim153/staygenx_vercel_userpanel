'use client';

import { useListingStore } from '../../create-listings/store';
import { useGlobalStore } from '@/lib/store/global-store';
import EditPrice from './editprice';

export default function Pricing() {
  const { ListingData } = useListingStore();
  const { setListingEdit } = useGlobalStore();
  return (
    <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <p className="capitalize text-[32px] font-semibold">{'Pricing'}</p>
      </div>
      <p className="text-start max-w-[450px] text-[#202020DB]">
        {
          'These settings apply to all nights, unless you customise them by date.'
        }
        <a href="#" className="underline text-[#202020DB]">
          {'Learn more'}
        </a>
      </p>
      <p className="capitalize text-[18px] ">{'Nightly price'}</p>
      <div
        onClick={() => setListingEdit({ isEdit: true, content: <EditPrice /> })}
        className="p-3 border rounded-xl w-full text-[32px] font-semibold cursor-pointer"
      >
        ₹{ListingData?.baseprice?.weekday}
      </div>
      <div
        onClick={() =>
          setListingEdit({
            isEdit: true,
            content: <EditPrice weekend={true} />,
          })
        }
        className="p-3 border rounded-xl w-full cursor-pointer"
      >
        <div className="flex justify-between items-center text-[16px]">
          <p>Custom weekend price</p>
          {/* <Trash2 size={18} className="cursor-pointer" /> */}
        </div>
        <p className=" text-[32px] font-semibold">
          ₹{ListingData?.baseprice?.weekend}
        </p>
      </div>
    </section>
  );
}
