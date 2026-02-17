import { useListeStore } from './store';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import PageContext from '../../contextprovider';
import Image from 'next/image';

export default function ActionHeader() {
  const Router = useRouter();
  const { Lists } = useListeStore();
  const { i18 } = useContext(PageContext);
  const Listing =
    typeof i18?.LISTINGPAGE === 'object' ? i18?.LISTINGPAGE : undefined;
  const ListingItems =
    Array.isArray(Lists) && Lists.length > 0
      ? Lists?.filter(i => i.status === 'Published')
      : [];
  return (
    <div
      className={`flex flex-col md:flex-row  bg-gray-100 p-4 w-full items-center ${ListingItems?.length > 3 ? '' : 'justify-center'} gap-3 overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide`}
    >
      {Array.isArray(ListingItems) &&
        ListingItems.length > 0 &&
        ListingItems.map(items => {
          return (
            <div
              onClick={() => Router.push(`/verify-listing/${items?._id}`)}
              key={items?._id}
              className="min-w-[400px] p-4 bg-white rounded-2xl shadow-md flex items-center gap-4"
            >
              <div className="bg-gray-100 p-2 flex items-center justify-center rounded-2xl w-[64px] h-[64px]">
                <Image
                  src={'/images/verification.avif'}
                  alt="img"
                  width={35}
                  height={35}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-[#6A6A6A] text-[13px]">
                  {items?.title ?? ''}
                </p>
                <p>
                  {(typeof Listing?.CONFIRMKEY === 'string' &&
                    Listing?.CONFIRMKEY) ||
                    'Confirm a few key details'}
                </p>
                <p className="text-[#6A6A6A]">
                  {(typeof Listing?.REQUIRETOPUBLISH === 'string' &&
                    Listing?.REQUIRETOPUBLISH) ||
                    'Required to publish'}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
