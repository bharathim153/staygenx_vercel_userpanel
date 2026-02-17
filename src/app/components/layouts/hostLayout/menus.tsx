'use client';
import { useGlobalStore } from '@/lib/store/global-store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useLayoutEffect } from 'react';
import PageContext from '../../contextprovider';
import { useListeStore } from '../../ui/hosting/store';

export default function Menus() {
  const { setOpenSearch } = useGlobalStore();
  const { i18 } = useContext(PageContext);
  const header =
    typeof i18?.TODAYPAGE === 'object' ? i18?.TODAYPAGE : undefined;
  const pathname = usePathname();
  const { Lists } = useListeStore();
  const ListingItems = Array.isArray(Lists) && Lists.length > 0 ? Lists : [];
  const Menus = [
    {
      name: header?.TODAY ?? 'Today',
      href: '/hosting/today',
    },
    {
      name: header?.CALENDAR ?? 'Calendar',
      href: `/hosting/calendar?id=${ListingItems[0]?._id || ''}`,
    },
    {
      name: header?.LISTING ?? 'Listings',
      href: '/hosting/listing',
    },
    {
      name: header?.MESSAGE ?? 'Message',
      href: '/message',
    },
    {
      name: header?.RESERVATION ?? 'Reservations',
      href: '/hosting/reservations',
    },
    {
      name: header?.REVIEW ?? 'Reviews',
      href: '/reviews',
    },
  ];
  useLayoutEffect(() => {
    setOpenSearch(false);
  }, [setOpenSearch]);
  return (
    <div className="flex gap-7 items-center">
      {Array.isArray(Menus) &&
        Menus.map((items, index) => {
          return (
            <div key={index}>
              <Link
                className={` hover:text-[#000] pb-2 ${pathname.startsWith(items?.href) ? 'text-[#000] text-[16px] border-b border-[#000] border-b-2' : 'text-[14px] text-[#6C6C6C]'}`}
                href={items?.href}
              >
                {typeof items?.name === 'string' ? items?.name : ''}
              </Link>
            </div>
          );
        })}
    </div>
  );
}
