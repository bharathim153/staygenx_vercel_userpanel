'use client';

import { useEffect, useState } from 'react';
import {
  DoorOpen,
  Handshake,
  KeySquare,
  Lock,
  MoreHorizontal,
  UserCheck,
} from 'lucide-react'; // or your custom icons
import Button from '@/shadcn/ui/Button';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { ArrivalGuide } from '@/services/listing/arrival-guide';
import { useListingStore } from '../../../create-listings/store';

const checkInOptions = [
  {
    id: 'smart_lock',
    title: 'Smart lock',
    description: 'Guests will use a code or app to open a wifi-connected lock.',
    icon: <DoorOpen className="w-6 h-6" />,
  },
  {
    id: 'keypad',
    title: 'Keypad',
    description:
      'Guests will use the code you provide to open an electronic lock.',
    icon: <KeySquare className="w-6 h-6" />,
  },
  {
    id: 'lockbox',
    title: 'Lockbox',
    description:
      'Guests will use a code you provide to open a small safe that has a key inside.',
    icon: <Lock className="w-6 h-6" />,
  },
  {
    id: 'building_staff',
    title: 'Building staff',
    description: 'Someone will be available 24 hours a day to let guests in.',
    icon: <UserCheck className="w-6 h-6" />,
  },
  {
    id: 'in_person',
    title: 'In-person greeting',
    description: 'Guests will meet you or your co-host to pick up keys.',
    icon: <Handshake className="w-6 h-6" />,
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Guests will use a different method not listed here.',
    icon: <MoreHorizontal className="w-6 h-6" />,
  },
];

export default function CheckInSelector() {
  const [selected, setSelected] = useState<string | null>(null);
  const { trigger, isPending } = useCustomMutation(ArrivalGuide);
  const { ListingData } = useListingStore();

  const handleSave = () => {
    const value = {
      ...ListingData?.arrivalguide,
      checkInMethod: selected,
    };
    trigger({ listingId: ListingData?.listingId ?? '', body: value });
  };
  useEffect(() => {
    setSelected(ListingData?.arrivalguide?.checkInMethod ?? '');
  }, [ListingData, setSelected]);
  return (
    <div className="">
      <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col  gap-6 h-[calc(100vh_-_160px)] overflow-auto scrollbar-hide">
        <h2 className="text-2xl font-semibold">Select a check-in method</h2>

        {checkInOptions.map(method => (
          <div
            key={method.id}
            onClick={() => setSelected(method.id)}
            className={`cursor-pointer flex flex-col border rounded-xl p-5 flex gap-4 items-start transition
            ${selected === method.id ? 'border-black border-2' : 'border-gray-300'}
            hover:border-black`}
          >
            <div className="">{method.icon}</div>
            <h3 className="text-lg font-semibold">{method.title}</h3>
            <p className="text-sm text-gray-600">{method.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end p-4 border-t sticky bottom-0 bg-[#fff]">
        <Button
          variant="black"
          onClick={handleSave}
          loading={isPending}
          // disabled={ListingData?.baseprice?.weekday === value || value === 0}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
