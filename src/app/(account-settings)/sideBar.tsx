'use client';

import { usePathname, useRouter } from 'next/navigation';
import { footerItem, ProfileItems, SettingsItems } from './menu';

export default function AccountSettingsSidebar() {
  const path = usePathname();
  const Router = useRouter();
  const menu = path.startsWith('/users/profile')
    ? ProfileItems()
    : SettingsItems();
  const footer = path !== '/users/profile';
  return (
    <div
      className={`mt-[30px] w-full  min-h-screen px-[20px] lg:px-[50px] space-y-4 text-sm`}
    >
      <h2 className="text-[26px] font-bold mb-4">
        {path === '/users/profile' ? 'Profile' : 'Account settings'}
      </h2>

      <ul className="space-y-1">
        {Array.isArray(menu) &&
          menu.map(item => (
            <li
              key={
                typeof item.label === 'string'
                  ? item.label
                  : JSON.stringify(item.label)
              }
              className={`flex items-center gap-3 px-8 py-4 rounded-lg cursor-pointer transition 
              ${path === item?.routes ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => Router.push(item?.routes)}
            >
              {item.icon}
              <span>
                {typeof item.label === 'string'
                  ? item.label
                  : JSON.stringify(item.label)}
              </span>
            </li>
          ))}
      </ul>
      {footer && (
        <>
          <hr className="my-4" />

          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => {}}
          >
            {footerItem.icon}
            <span className="font-medium">{footerItem.label}</span>
          </div>
        </>
      )}
    </div>
  );
}
