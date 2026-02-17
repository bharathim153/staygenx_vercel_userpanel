'use client';
import { X } from 'lucide-react';

import { useMessageStore } from './store';
import useScreenWidth from '@/hooks/useScreenWidth';
import Button from '@/shadcn/ui/Button';
import Image from 'next/image';

export default function ReservationSummary() {
  const { setReserveSection, reservationSection, setMessageList } =
    useMessageStore();
  const screen = useScreenWidth();
  return (
    <div className="flex flex-col">
      <div className="p-5 border-b hidden md:flex justify-between">
        <h2 className="text-[18px]">Reservation</h2>
        <Button
          variant="gray"
          onClick={() => {
            if (
              screen?.width !== undefined &&
              screen?.width &&
              screen?.width < 1120
            ) {
              const url = new URL(window.location.href);
              url.searchParams.delete('details');
              window.history.replaceState({}, '', url.toString());
              setReserveSection(!reservationSection);
              setMessageList(true);
            }
            setReserveSection(!reservationSection);
          }}
          className="flex items-center  p-2 rounded-full cursor-pointer"
        >
          <X size={17} />
        </Button>
      </div>
      <aside className="w-full md:w-[350px]  overflow-y-auto  p-4 space-y-4">
        <div className="rounded-xl overflow-hidden shadow-md">
          <div className="relative h-[180px]">
            <Image
              src="https://a0.muscache.com/im/pictures/hosting/Hosting-1270314768198309910/original/c389f712-5665-4b38-b83b-29f9b8fd73d0.jpeg?im_w=1200"
              alt="villa"
              fill
              className="object-cover"
            />
            <span className="absolute top-2 left-2 bg-white px-2 py-1 text-xs font-semibold rounded">
              ENQUIRY SENT
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Ready to book?</h3>
          <p className="text-sm text-gray-600">
            Sowmya Behara lets guests book instantly.
          </p>
          <Button className="mt-3 w-full border border-black py-2 rounded-lg font-medium">
            Book now
          </Button>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Trip Details</h4>
          <p className="text-sm font-medium">
            La Luxo. Infinity Pool Villa 5 mins @ Anjuna Beach
          </p>
          <p className="text-sm text-gray-500">
            Entire villa · Anjuna, Goa, IN
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Trip Details</h2>

          <div>
            <p className="font-semibold text-sm">
              La Luxo. Infinity Pool Villa 5 mins @ Anjuna Beach
            </p>
            <p className="text-sm text-gray-600">
              Entire villa · Anjuna, Goa, IN
            </p>
          </div>

          <hr />

          <div className="flex items-center justify-between text-sm">
            <p>Hosted by Sowmya Behara</p>
            <Image
              src="/sowmya.jpg"
              alt="Sowmya"
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <p>Co-hosted by Vaibhav</p>
            <Image
              src="/vaibhav.jpg"
              alt="Vaibhav"
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>

          <hr />

          <div className="flex justify-between text-sm">
            <span>Check-in</span>
            <span>25 Jul 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Checkout</span>
            <span>27 Jul 2025</span>
          </div>
        </div>

        <div className="space-y-4 border-b pb-6">
          <h2 className="text-lg font-semibold">Payment Details</h2>

          <div className="flex justify-between text-sm">
            <span>₹3,965.59 x 2 nights</span>
            <span>₹7,931.18</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Taxes</span>
            <span>₹834</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold text-sm">
            <span>Price after discount</span>
            <span>₹8,765.18</span>
          </div>

          <hr className="my-2" />

          <div className="text-xs text-gray-600 space-y-2">
            <p className="font-semibold">Always communicate through Staygenx</p>
            <p>
              To protect your payment, never transfer money or communicate
              outside the Staygenx website or app.
            </p>
            <a href="#" className="text-teal-600 font-medium">
              Learn more
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
