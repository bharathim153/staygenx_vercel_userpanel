'use client';

import { Globe, Menu } from 'lucide-react';
import PopoverComponent from '@/shadcn/ui/popover';
import { useGlobalStore } from '@/lib/store/global-store';
import { useContext, useEffect } from 'react';
import { getCookie } from '@/utils/helper';
import { useMenuItems } from './profilemenus';
import UserProfile from '../userProfile';
import PageContext from '../contextprovider';
import { usePathname, useRouter } from 'next/navigation';
import Button from '@/shadcn/ui/Button';

export default function Profile() {
  const Router = useRouter();
  const pathname = usePathname();
  const menuItems = useMenuItems();
  const { i18 } = useContext(PageContext);
  const menu =
    typeof i18?.HOMEPAGE?.HEADER?.MENU === 'object'
      ? i18?.HOMEPAGE?.HEADER?.MENU
      : undefined;
  const { isLoggedin, setIsLoggedIn } = useGlobalStore();
  const token = getCookie('appToken');
  const userId = getCookie('appUserId');

  useEffect(() => {
    if (token && userId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  return (
    <div className="hidden md:flex items-center gap-3 relative z-50">
      {isLoggedin ? (
        <div className="flex items-center gap-1">
          <Button
            onClick={() => Router.push('/hosting/today')}
            className="py-2 px-4 font-semibold  hover:bg-gray-100 rounded-full text-[15px]"
          >
            {pathname.startsWith('/hosting')
              ? (menu?.SWITCH_TO_TRAVELLING ?? 'Switch to travelling')
              : (menu?.SWITCH_TO_HOST ?? 'Switch to hosting')}
          </Button>
          <UserProfile />
        </div>
      ) : (
        <>
          <p className="font-semibold hidden md:block cursor-pointer hover:underline text-[13px]">
            {menu?.BECOME_A_HOST ?? 'Become a host'}
          </p>

          <div className="flex items-center bg-gray-200 p-2 rounded-full cursor-pointer">
            <Globe size={18} />
          </div>
        </>
      )}

      <PopoverComponent
        align="end"
        className="focus:outline-none"
        trigger={
          <div className="flex items-center bg-gray-200 p-2 rounded-full cursor-pointer">
            <Menu size={18} />
          </div>
        }
        content={
          <ul className="w-[280px] bg-white rounded-xl shadow-lg  text-sm py-2">
            {menuItems.map((item, idx) => {
              if (item.divider) {
                return (
                  <hr key={`divider-${idx}`} className="my-2 border-gray-200" />
                );
              }

              return (
                <li
                  key={
                    typeof item.label === 'string' ? item.label : `item-${idx}`
                  }
                  onClick={item.onClick}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition flex items-start gap-3"
                >
                  {item.image ? (
                    <div className="flex gap-3 items-start w-full">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {typeof item.label === 'string' ? item.label : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.subLabel}
                        </p>
                      </div>
                      {/* <Image
                        src={item.image}
                        alt="host"
                        width={32}
                        height={32}
                        className="object-contain"
                      /> */}
                    </div>
                  ) : (
                    <>
                      {item.icon && <div className="mt-0.5">{item.icon}</div>}
                      <div>
                        <p className="font-medium">
                          {typeof item.label === 'string' ? item.label : ''}
                        </p>
                        {item.subLabel && (
                          <p className="text-xs text-muted-foreground">
                            {item.subLabel}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        }
      />
    </div>
  );
}
