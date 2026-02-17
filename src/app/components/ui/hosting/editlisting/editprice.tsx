'use client';

import { useForm, Controller } from 'react-hook-form';
// import { MapPin } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import Button from '@/shadcn/ui/Button';
import PageContext from '@/app/components/contextprovider';
import { useListingStore } from '../../create-listings/store';
import { useCreateListingApi } from '../../create-listings/store/api';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useGlobalStore } from '@/lib/store/global-store';

type PriceFormData = {
  weekdayBasePrice: string;
  weekendBasePrice: string;
};

export default function Price({ weekend = false }: { weekend?: boolean }) {
  const { ListingData, SetListingData } = useListingStore();
  const {
    control,
    watch,
    setValue: setFormValue,
  } = useForm<PriceFormData>({
    defaultValues: {
      weekdayBasePrice: ListingData?.baseprice?.weekday.toString(),
      weekendBasePrice: ListingData?.baseprice?.weekend.toString(),
    },
  });

  const { i18 } = useContext(PageContext);
  const pricei18 =
    typeof i18?.CREATELISTING?.PRICE === 'object'
      ? i18.CREATELISTING.PRICE
      : {};
  const { CreateListing } = useCreateListingApi();
  const { setListingEdit } = useGlobalStore();
  const { trigger, isPending } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      if (data) {
        SetListingData({
          ...ListingData,
          baseprice: {
            weekday: data?.data?.weekdayBasePrice as number,
            weekend: data?.data?.weekendBasePrice as number,
          },
        });
      }
    },
  });
  const [value, setValue] = useState(
    weekend ? ListingData?.baseprice?.weekend : ListingData?.baseprice?.weekday
  );
  const BasePrice = watch(weekend ? 'weekendBasePrice' : 'weekdayBasePrice');
  const numericValue = parseInt(BasePrice.replace(/\D/g, ''), 10) || 0;
  const guestPrice = Math.round(numericValue * 1.14);

  const handleSave = () => {
    const data: Partial<{ listingId: string }> = {};
    if (ListingData?.listingId) {
      data.listingId = ListingData?.listingId;
    }
    trigger({
      data,
      step: 14,
      isEdit: true,
      editdata: {
        weekday: weekend ? ListingData?.baseprice?.weekday : value,
        weekend: weekend ? value : ListingData?.baseprice?.weekend,
      },
    });
  };

  useEffect(() => {
    setValue(numericValue);
  }, [numericValue]);

  useEffect(() => {
    debugger;
    setFormValue(
      'weekdayBasePrice',
      ListingData?.baseprice?.weekday.toString()
    );
    setFormValue(
      'weekendBasePrice',
      ListingData?.baseprice?.weekend.toString()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ListingData?.baseprice]);
  console.log('ListingData', ListingData);
  return (
    <div className="h-full">
      <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6 h-[calc(100vh_-_160px)]">
        <div className="flex flex-col justify-around gap-6 items-center">
          <form className="flex flex-col justify-center gap-6 items-center w-full">
            <div className="text-start w-full p-10">
              <h1 className="text-[30px] md:text-[32px] font-bold">
                {weekend ? 'Custom weekend price' : 'Nighty price'}
              </h1>
            </div>
            {weekend && <p className="text-[#6A6A6A]">Fri and Sat nights</p>}
            <div className="flex flex-col items-center">
              <Controller
                name={weekend ? 'weekendBasePrice' : 'weekdayBasePrice'}
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-center text-[32px] font-bold gap-1">
                    <span className="text-[32px] font-bold">₹</span>
                    <input
                      {...field}
                      inputMode="numeric"
                      value={value}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '');
                        field.onChange(digits);
                      }}
                      className="text-[32px] font-bold text-left outline-none bg-transparent w-[100px]"
                    />
                  </div>
                )}
              />

              {/* Guest price display */}
              <p className="text-[#6A6A6A] mt-2 text-center">
                {(typeof pricei18.DESC === 'string' && pricei18.DESC) ||
                  'Guest price before taxes'}{' '}
                ₹{guestPrice.toLocaleString('en-IN')}
              </p>
            </div>
          </form>

          {/* {
                        !weekend &&
                        <Button
                            variant="transparent"
                            className="py-3 px-4 flex items-center gap-2 justify-between border shadow-md rounded-full hover:border-black"
                        >
                            <MapPin color="#FF385C" className="w-4 h-4" />
                            <span className="text-sm">
                                {typeof pricei18.BUTTON === 'string' && pricei18.BUTTON || "Show similar listings"}
                            </span>
                        </Button>
                    } */}
        </div>
      </section>
      <div className="flex justify-between p-4 border-t sticky bottom-0">
        <Button
          onClick={() => setListingEdit({ isEdit: false, content: null })}
        >
          Cancel
        </Button>
        <Button
          variant="black"
          onClick={handleSave}
          loading={isPending}
          disabled={
            (weekend
              ? ListingData?.baseprice?.weekend
              : ListingData?.baseprice?.weekday) === value || value === 0
          }
        >
          Save
        </Button>
      </div>
    </div>
  );
}
