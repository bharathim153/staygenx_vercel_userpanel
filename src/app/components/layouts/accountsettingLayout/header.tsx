'use client';
import { usePathname } from 'next/navigation';
import Profile from '../../header/profile';
import Logo from '../../logo';
// import { useContext } from 'react';
// import PageContext from '../../contextprovider';

export default function Header() {
  // const { i18 } = useContext(PageContext);
  // const Common = typeof i18?.COMMON === 'object' ? i18?.COMMON : undefined;
  const path = usePathname();
  const ispath = path.startsWith('/users/profile');
  return (
    <div className="flex px-[74px] py-[24px] justify-between  border-b  w-full bg-[#fff]">
      <Logo />
      {ispath && <Profile />}
    </div>
  );
}
