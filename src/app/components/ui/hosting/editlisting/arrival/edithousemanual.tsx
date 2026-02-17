'use client';

import { useEffect, useState } from 'react';
import { Trash2, Power, Lock, Bath, KeyRound } from 'lucide-react';
import Button from '@/shadcn/ui/Button';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { ArrivalGuide } from '@/services/listing/arrival-guide';
import { useListingStore } from '../../../create-listings/store';

export default function EditHouseManual() {
  const instructions = [
    {
      id: 'Gather used towels',
      label: 'Gather used towels',
      icon: <Bath size={24} />,
    },
    {
      id: 'Throw rubbish away',
      label: 'Throw rubbish away',
      icon: <Trash2 size={24} />,
    },
    {
      id: 'Turn things off',
      label: 'Turn things off',
      icon: <Power size={24} />,
    },
    { id: 'Lock up', label: 'Lock up', icon: <Lock size={24} /> },
    { id: 'Return keys', label: 'Return keys', icon: <KeyRound size={24} /> },
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { trigger, isPending } = useCustomMutation(ArrivalGuide);
  const { ListingData } = useListingStore();
  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlesave = () => {
    const value = {
      ...ListingData?.arrivalguide,
      checkoutInstructions: selectedIds,
    };
    trigger({ listingId: ListingData?.listingId ?? '', body: value });
  };
  useEffect(() => {
    setSelectedIds(ListingData?.arrivalguide?.checkoutInstructions ?? []);
  }, [ListingData]);
  return (
    <div>
      <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6 h-[calc(100vh_-_160px)]">
        <h2 className="text-2xl font-semibold mb-6">Choose instructions</h2>
        <div className="space-y-4">
          {instructions.map(item => (
            <button
              key={item.id}
              onClick={() => toggleSelection(item.id)}
              className={`
                                w-full flex items-center gap-4 p-6 rounded-md border cursor-pointer
                                text-left transition
                                ${selectedIds.includes(item.id) ? 'border-black shadow-sm bg-gray-50' : 'border-gray-200'}
                                hover:bg-gray-50
                            `}
            >
              <div className="text-black">{item.icon}</div>
              <span className="text-base font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end p-4 border-t sticky bottom-0 bg-[#fff]">
        <Button variant="black" loading={isPending} onClick={handlesave}>
          Save
        </Button>
      </div>
    </div>
  );
}
