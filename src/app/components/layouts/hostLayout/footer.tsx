// BottomNav.tsx
'use client';

import { useContext, useEffect, useState } from 'react';
import {
  MessageSquare,
  CalendarFold,
  Menu,
  Bookmark,
  LayoutList,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import Button from '@/shadcn/ui/Button';
import PageContext from '../../contextprovider';

export default function BottomNav() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { i18 } = useContext(PageContext);
  const header =
    typeof i18?.TODAYPAGE === 'object' ? i18?.TODAYPAGE : undefined;
  const FooterMenus = [
    {
      name: header?.TODAY ?? 'Today',
      href: '/hosting/today',
      icon: <Bookmark />,
    },
    {
      name: header?.CALENDAR ?? 'Calendar',
      href: '/hosting/calendar',
      icon: <CalendarFold />,
    },
    {
      name: header?.LISTING ?? 'Listings',
      href: '/hosting/listing',
      icon: <LayoutList />,
    },
    {
      name: header?.MESSAGE ?? 'Message',
      href: '/hosting/message',
      icon: <MessageSquare />,
    },
    {
      name: header?.MENU ?? 'Menu',
      href: '/hosting/message',
      icon: <Menu />,
    },
  ];

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
        'fixed bottom-0 left-0 z-50 w-full bg-white border-t shadow-md transition-transform duration-300 md:hidden',
        show ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="flex flex-grow flex-shrink-0 basis-auto justify-center items-center py-2">
        {Array.isArray(FooterMenus) &&
          FooterMenus.map((items, index) => {
            return (
              <NavItem
                key={index}
                icon={items?.icon}
                label={typeof items?.name === 'string' ? items?.name : ''}
                active={items?.href}
              />
            );
          })}
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: string;
}) {
  const pathname = usePathname();
  const Router = useRouter();
  return (
    <Button
      onClick={() => Router.push(active ?? '/')}
      className="flex flex-col flex-grow flex-shrink items-center justify-center text-xs max-w-[20%] min-w-0"
    >
      <div
        className={clsx(
          'mb-1',
          active === pathname ? 'text-rose-600' : 'text-gray-500'
        )}
      >
        {icon}
      </div>
      <span
        className={clsx(
          'font-medium',
          active === pathname ? 'text-rose-600' : 'text-gray-500'
        )}
      >
        {label}
      </span>
    </Button>
  );
}
