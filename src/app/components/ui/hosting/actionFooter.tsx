'use client';
import clsx from 'clsx';

import { useEffect, useState } from 'react';
import { useListeStore } from './store';
import { useDrawerStore } from '@/lib/store/drawer-store';
import Image from 'next/image';

export default function ActionFooter() {
  const { Lists } = useListeStore();
  const { openDrawer } = useDrawerStore();
  const ListingItems =
    Array.isArray(Lists) && Lists.length > 0
      ? Lists?.filter(i => i.status === 'Published')
      : [];
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={clsx(
        'fixed bottom-[60px] left-0 z-50 w-full py-4 px-6 bg-white border-t rounded-t-xl shadow-md transition-transform duration-300 md:hidden',
        show ? 'translate-y-0' : 'translate-y-80'
      )}
      onClick={() => openDrawer('actionDrawer')}
    >
      <div className="flex gap-5">
        <div className="relative inline-block">
          <div className="relative w-12 h-12">
            {ListingItems[1]?.images[1] && (
              <div className="absolute -top-1 left-1 w-12 h-12 rounded-xl overflow-hidden shadow-md border bg-white">
                <Image
                  src={
                    ListingItems[1]?.images[1] &&
                    process.env.NEXT_PUBLIC_IMAGE_URL +
                      ListingItems[1]?.images[1]
                  }
                  alt="Back"
                  height={48}
                  width={48}
                  className="object-cover"
                />
              </div>
            )}

            {ListingItems[0]?.images[0] && (
              <div className="absolute top-0 left-0 w-12 h-12 rounded-xl overflow-hidden shadow-md border bg-white">
                <Image
                  src={
                    ListingItems[0]?.images[0] &&
                    process.env.NEXT_PUBLIC_IMAGE_URL +
                      ListingItems[0]?.images[0]
                  }
                  alt="Front"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="absolute -top-2 -left-2 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            {ListingItems.length}
          </div>
        </div>

        <div className="flex flex-col">
          <p>Confirm a few key details</p>
          <p className="text-[#6A6A6A] ">Required to publish</p>
        </div>
      </div>
    </div>
  );
}
