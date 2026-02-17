// BottomNav.tsx
'use client';

import { useEffect, useState } from 'react';
import { Search, Heart, MessageSquare, CircleUserRound } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useGlobalStore } from '@/lib/store/global-store';

import Button from '@/shadcn/ui/Button';
import Image from 'next/image';

export default function BottomNav() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isLoggedin } = useGlobalStore();

  const FooterMenus = [
    {
      icon: <Search className="w-5 h-5" />,
      label: 'Explore',
      active: '/',
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Wishlist',
      active: '/wishlist',
    },
    ...(isLoggedin
      ? [
          {
            icon: (
              <Image
                src="/svg/logomob.svg"
                alt="logo"
                width={100}
                height={100}
                className="block w-[25px] h-[25px] md:hidden"
              />
            ),
            label: 'Trips',
            active: '/trips',
          },
          {
            icon: <MessageSquare className="w-5 h-5" />,
            label: 'Message',
            active: '/message',
          },
          {
            icon: <CircleUserRound className="w-5 h-5" />,
            label: 'Profile',
            active: '/users/profile',
          },
        ]
      : [
          {
            icon: <CircleUserRound className="w-5 h-5" />,
            label: 'Login in',
            active: '/login',
          },
        ]),
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
  // console.log('show', show, lastScrollY);
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
                label={items?.label}
                active={items?.active}
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
