'use client';
import { ChevronRight } from 'lucide-react';
import { useListingStore } from '../../create-listings/store';
import { useGlobalStore } from '@/lib/store/global-store';
import EditDescription from './editdescription';

export default function Description() {
  const { ListingData } = useListingStore();
  const { setListingEdit, ListingEdit } = useGlobalStore();
  const sections = [
    {
      title: 'Listing description',
      subtitle: ListingData?.description?.description ?? '',
    },
    // {
    //     title: "Your property",
    //     subtitle: "Add details",
    // },
    // {
    //     title: "Guest access",
    //     subtitle: "Add details",
    // },
    // {
    //     title: "Interaction with guests",
    //     subtitle: "Add details",
    // },
    // {
    //     title: "Other details to note",
    //     subtitle: "Add details",
    // },
  ];
  return (
    <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6">
      <p className="capitalize text-[32px] font-semibold">{'Description'}</p>
      <div className="w-full space-y-3">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`flex justify-between items-center p-4 rounded-lg cursor-pointer hover:bg-gray-50 ${ListingEdit?.title === section?.title ? 'bg-gray-100' : ''} `}
            onClick={() =>
              setListingEdit({
                isEdit: true,
                content: <EditDescription />,
                title: section?.title,
              })
            }
          >
            <div>
              <h2 className="text-[15px] font-medium text-gray-800">
                {section.title}
              </h2>
              <p className="text-sm text-gray-500">{section.subtitle}</p>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        ))}
      </div>
    </section>
  );
}
