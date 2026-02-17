'use client';

import { format } from 'date-fns';
import { ListingTypes } from './store';
import { useContext } from 'react';
import PageContext from '../../contextprovider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDialogStore } from '@/lib/store/dialog-store';

export default function ListingTable({
  ListingItems,
}: {
  ListingItems: ListingTypes[];
}) {
  const { i18 } = useContext(PageContext);
  const Listing =
    typeof i18?.LISTINGPAGE === 'object' ? i18?.LISTINGPAGE : undefined;
  const Router = useRouter();
  const { openDialog } = useDialogStore();
  const handleClick = (status: string, item: ListingTypes, index: number) => {
    if (status === 'Published') {
      Router.push(`/hosting/listing/editor/${item?._id}/details/photo-tour`);
    } else {
      openDialog('editlisting', { index });
    }
  };
  return (
    <div className="">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="pl-4">
                {(typeof Listing?.LISTING === 'string' && Listing?.LISTING) ||
                  'Listing'}
              </th>
              <th>
                {(typeof Listing?.TYPE === 'string' && Listing?.TYPE) || 'Type'}
              </th>
              <th>
                {(typeof Listing?.LOCATION === 'string' && Listing?.LOCATION) ||
                  'Location'}
              </th>
              <th>
                {(typeof Listing?.STATUS === 'string' && Listing?.STATUS) ||
                  'Status'}
              </th>
            </tr>
          </thead>
          <tbody>
            {ListingItems.map((item, index) => {
              const imageSrc = item?.images?.[0] ? `${item.images[0]}` : '';

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

              const statusDotColor = {
                Published: 'bg-green-600',
                'In progress': 'bg-orange-500',
                'Action required': 'bg-red-600',
              }[status];

              const title =
                item.title ||
                `${(typeof Listing?.LISTINGSTARTED === 'string' && Listing?.LISTINGSTARTED) || 'Your listing started on'} ${format(new Date(item?.createdAt), 'dd MMMM yyyy')}`;

              return (
                <tr
                  key={index}
                  className="cursor-pointer"
                  onClick={() => handleClick(status, item, index)}
                >
                  <td colSpan={4} className="px-2 py-1">
                    <div className="bg-white hover:bg-gray-100 transition-all rounded-xl px-4 py-4 flex items-center justify-between">
                      {/* Listing Column */}
                      <div className="flex items-center gap-4">
                        {imageSrc !== '' ? (
                          <Image
                            src={process.env.NEXT_PUBLIC_IMAGE_URL + imageSrc}
                            alt={item.title || 'Listing'}
                            width={60}
                            height={60}
                            className="rounded-xl object-cover w-[60px] h-[60px]"
                          />
                        ) : (
                          <div className="bg-gray-200 rounded-xl w-[60px] h-[60px]" />
                        )}
                        <p className="font-medium text-sm min-w-[240px]">
                          {title}
                        </p>
                      </div>

                      {/* Type */}
                      <div className="text-sm text-gray-700 text-center">
                        {item?.category?.name || ''}
                      </div>

                      {/* Location */}
                      <div className="text-sm text-gray-700 w-1/4">
                        {item.city || 'Unknown'}, {item.state || ''}
                      </div>

                      {/* Status */}
                      <div className="text-sm text-gray-700 w-1/4 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${statusDotColor}`}
                        />
                        {status}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
