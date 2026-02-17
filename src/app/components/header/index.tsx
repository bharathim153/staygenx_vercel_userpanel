'use client';
import React from 'react';
import Profile from './profile';
import { useGlobalStore } from '@/lib/store/global-store';
import Logo from '../logo';
import SuccessHeader from '../successheader';

interface LayoutProps {
  centerComp: React.ReactNode;
  center?: boolean;
  profile?: boolean;
  maxWidth?: string;
  sticky?: boolean;
}

export default function Header({
  centerComp,
  center = true,
  profile = true,
  maxWidth = 'max-w-[1400px]',
  sticky = true,
}: LayoutProps) {
  const { openSearch, successHeader } = useGlobalStore();
  return (
    <>
      <div
        className={`${sticky ? 'fixed top-0 left-0 z-50' : ''} w-full bg-white shadow-sm  ${openSearch ? 'md:h-[160px]' : 'md:h-[80px]'} transition-all duration-300`}
        style={{
          background: 'linear-gradient(180deg,#ffffff 39.9%,#f8f8f8 100%)',
        }}
      >
        <div
          className={`relative w-full   flex items-start justify-between ${maxWidth}  mx-auto px-4 md:py-4 `}
        >
          <div className="hidden md:block z-99">
            <Logo />
          </div>
          {center && (
            <div
              className={`flex items-center justify-center w-full p-4 md:p-0 md:absolute  ${openSearch ? 'left-0' : 'left-[-75px]'}  lg:left-0 top-4`}
            >
              {centerComp && centerComp}
            </div>
          )}

          <div>{profile && <Profile />}</div>
        </div>
      </div>
      {successHeader?.header && <SuccessHeader />}
    </>
  );
}
