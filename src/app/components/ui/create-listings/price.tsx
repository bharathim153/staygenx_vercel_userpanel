'use client';

import { useForm, Controller } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import {
  useState,
  useRef,
  useEffect,
  useContext,
  useLayoutEffect,
} from 'react';
import Button from '@/shadcn/ui/Button';
import { useListingStore } from './store';
import PageContext from '../../contextprovider';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';

type PriceFormData = {
  weekdayBasePrice: string;
};

export default function Price() {
  const { control, handleSubmit, watch, setFocus } = useForm<PriceFormData>({
    defaultValues: {
      weekdayBasePrice: '0',
    },
  });
  const { i18 } = useContext(PageContext);
  const { setDisabled } = useListingContext();
  const pricei18 =
    typeof i18?.CREATELISTING?.PRICE === 'object'
      ? i18.CREATELISTING.PRICE
      : {};

  const { SetListingData, ListingData } = useListingStore();
  const [isEditing, setIsEditing] = useState(false);
  const price = watch('weekdayBasePrice');
  const guestPrice = Math.round(parseInt(price || '0') * 1.14);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(300);
  const [fontSize, setFontSize] = useState(96);

  // Dynamically resize width and font based on value
  useEffect(() => {
    if (!spanRef.current) return;

    const rawWidth = spanRef.current.offsetWidth;
    const maxWidth = 680;
    const baseWidth = 400;
    const minFontSize = 36;
    const maxFontSize = 96;

    const clampedWidth = Math.min(rawWidth + 60, maxWidth);
    setInputWidth(clampedWidth);

    if (clampedWidth <= baseWidth) {
      setFontSize(maxFontSize);
    } else {
      const scale = (clampedWidth - baseWidth) / (maxWidth - baseWidth);
      const adjustedSize = maxFontSize - (maxFontSize - minFontSize) * scale;
      setFontSize(Math.max(minFontSize, Math.round(adjustedSize)));
    }
  }, [price]);

  useEffect(() => {
    SetListingData({
      baseprice: {
        weekday: parseInt(price),
        weekend: ListingData?.baseprice?.weekend,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, SetListingData]);

  const toggleEdit = () => {
    setIsEditing(true);
    setTimeout(() => setFocus('weekdayBasePrice'), 0);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const related = e.relatedTarget as Node | null;
    if (!wrapperRef.current?.contains(related as Node)) {
      setIsEditing(false);
    }
  };
  useLayoutEffect(() => {
    if (
      ListingData?.baseprice?.weekday !== 0 ||
      ListingData?.baseprice?.weekend !== 0
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [ListingData, setDisabled]);
  return (
    <div className="max-w-[630px] h-full mx-auto flex flex-col justify-around gap-6 items-center">
      <form
        onSubmit={handleSubmit(() => setIsEditing(false))}
        className="flex flex-col justify-center gap-6 items-center w-full"
      >
        <div className="text-start w-full">
          <h1 className="text-[30px] md:text-[32px] font-bold">
            {(typeof pricei18.TITLE === 'string' && pricei18.TITLE) ||
              'Now, set a weekday base price'}
          </h1>
          {/* <p className="text-[#6A6A6A]">
                        Tip: ₹2,172. You’ll set a weekend price next.
                    </p> */}
        </div>

        <div ref={wrapperRef} className="relative flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* ₹ symbol */}
            <span
              className="absolute left-0 font-bold"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.1 }}
            >
              ₹
            </span>

            {/* Input field */}
            <Controller
              name="weekdayBasePrice"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  onChange={e => {
                    const onlyDigits = e.target.value.replace(/\D/g, '');
                    field.onChange(onlyDigits);
                  }}
                  onBlur={handleBlur}
                  onFocus={() => setIsEditing(true)}
                  className="pl-15 font-bold outline-none bg-transparent text-black transition-all duration-150"
                  style={{
                    fontSize: `${fontSize}px`,
                    width: `${inputWidth}px`,
                    lineHeight: 1.1,
                  }}
                />
              )}
            />

            {/* Hidden span for width calc */}
            <span
              ref={spanRef}
              className="invisible absolute top-0 left-0 font-bold whitespace-pre"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.1 }}
            >
              {Number(price || '0').toLocaleString('en-IN')}
            </span>

            {/* Edit button */}
            {!isEditing && (
              <Button
                type="button"
                onClick={toggleEdit}
                className="absolute -right-12 bottom-2 p-2 border rounded-full hover:bg-gray-100"
              >
                <Pencil className="w-4 h-4 text-black" />
              </Button>
            )}
          </div>

          {/* Guest price display */}
          <p className="text-[#6A6A6A] mt-2 text-center">
            {(typeof pricei18.DESC === 'string' && pricei18.DESC) ||
              'Guest price before taxes'}{' '}
            ₹{guestPrice.toLocaleString('en-IN')}
          </p>
        </div>
      </form>

      {/* <Button
        variant="transparent"
        className="py-3 px-4 flex items-center gap-2 justify-between border shadow-md rounded-full hover:border-black"
      >
        <MapPin color="#FF385C" className="w-4 h-4" />
        <span className="text-sm">
          {(typeof pricei18.BUTTON === 'string' && pricei18.BUTTON) ||
            'Show similar listings'}
        </span>
      </Button> */}
    </div>
  );
}
