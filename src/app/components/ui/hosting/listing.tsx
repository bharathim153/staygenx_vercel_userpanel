'use client';

import { cn } from '@/lib/utils'; // Optional: if you're using a `cn()` helper for merging classNames
import { format } from 'date-fns';
import { LayoutGrid, Plus } from 'lucide-react';
import { useContext, useState } from 'react';
import ListingTable from './listingtable';
import { useRouter } from 'next/navigation';
import { useDialogStore } from '@/lib/store/dialog-store';
import { ListingTypes, useListeStore } from './store';
import ActionHeader from './actionHeader';
import PageContext from '../../contextprovider';
import { useListingStore } from '../create-listings/store';
import Image from 'next/image';

export default function Listing() {
  const Router = useRouter();
  const { i18 } = useContext(PageContext);
  const Listing =
    typeof i18?.LISTINGPAGE === 'object' ? i18?.LISTINGPAGE : undefined;
  const { openDialog } = useDialogStore();
  const { Lists, loading } = useListeStore();
  const ListingItems = Array.isArray(Lists) && Lists.length > 0 ? Lists : [];
  const { ResetListingData } = useListingStore();
  const [isGridView, setIsGridView] = useState(true);

  console.log('ListingItems:', ListingItems);

  const handleClick = (status: string, item: ListingTypes, index: number) => {
    if (status === 'Published') {
      Router.push(`/hosting/listing/editor/${item?._id}/details/photo-tour`);
    } else {
      openDialog('editlisting', { index });
    }
  };
  const handleClickPlus = () => {
    Router.push('/become-a-host/overview');
    ResetListingData();
  };
  return (
    <div className="mt-0 md:mt-[88px]">
      <div className="hidden md:block">
        {ListingItems.length > 0 && <ActionHeader />}
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold mb-8">Your listings</h2>
          <div className="flex gap-3">
            <div
              onClick={() => setIsGridView(!isGridView)}
              className="flex items-center bg-gray-200 p-3 rounded-full cursor-pointer"
            >
              {!isGridView ? (
                <LayoutGrid size={18} />
              ) : (
                <Image
                  src={'/svg/horizontal.svg'}
                  alt="img"
                  width={18}
                  height={18}
                />
              )}
            </div>
            <div
              onClick={handleClickPlus}
              className="flex items-center bg-gray-200 p-3 rounded-full cursor-pointer"
            >
              <Plus size={18} />
            </div>
          </div>
        </div>
        {isGridView ? (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse  p-4 space-y-4">
                  <div className="h-70 bg-gray-200 rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ListingItems.map((item, index) => {
                // const imageSrc = item?.images?.[0]
                //   ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images[0]}`
                //   : '';

                const status =
                  item.status === 'Published'
                    ? (typeof Listing?.PUBLISH === 'string' &&
                        Listing?.PUBLISH) ||
                      'Published'
                    : item.weekendBasePrice
                      ? (typeof Listing?.INPROGRESS === 'string' &&
                          Listing?.INPROGRESS) ||
                        'In progress'
                      : (typeof Listing?.ACTIONREQ === 'string' &&
                          Listing?.ACTIONREQ) ||
                        'Action required';

                return (
                  <div
                    onClick={() => handleClick(status, item, index)}
                    key={index}
                    className="flex flex-col"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden transition-all cursor-pointer">
                      <div className="relative ">
                        {item?.images[0] !== '' ? (
                          <>
                            {/* <p>{item.images[0]}</p> */}
                            <img
                              src={item.images[0]}
                              alt="Listing Image"
                              className="rounded-2xl object-cover h-[300px] w-full"
                            />
                          </>
                        ) : (
                          // <Image
                          //   src={item.images[0]}
                          //   alt={item.title || 'Listing'}
                          //   width={800}
                          //   height={800}
                          //   className="rounded-2xl object-cover h-[300px]"
                          // />
                          <div className="bg-gray-200 w-full h-[300px] rounded-2xl" />
                        )}

                        <div
                          className={cn(
                            'absolute top-4 left-4 px-3 py-1 text-sm font-medium rounded-full bg-white'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full ',
                                status === 'Published' && 'bg-green-600 ',
                                status === 'In progress' && 'bg-yellow-600 ',
                                status === 'Action required' && 'bg-red-600 '
                              )}
                            />
                            {status}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold truncate">
                        {item.title ||
                          `Your listing started on ${format(new Date(item?.createdAt), 'dd MMMM yyyy')} `}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {(typeof Listing?.HOUSEIN === 'string' &&
                          Listing?.HOUSEIN) ||
                          'Home in'}{' '}
                        {item.city || 'Unknown'}, {item.state || ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <ListingTable ListingItems={ListingItems ?? []} />
        )}
      </div>
    </div>
  );
}
