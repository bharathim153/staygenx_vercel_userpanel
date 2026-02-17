'use client';
import React, { useEffect } from 'react';
import Menus from './menus';
import Logo from '../../logo';
import Profile from '../../header/profile';
import { useListeStore } from '../../ui/hosting/store';
import { Listings } from '@/services/listing/getapis';

export default function Header() {
  const { Lists } = useListeStore();
  useEffect(() => {
    if (Lists.length === 0) {
      Listings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className=" fixed top-0 flex px-12 py-[24px] justify-between  border-b  w-full bg-[#fff] z-50">
      <Logo />
      <Menus />
      <Profile />
    </div>
  );
}
