'use client';
import { ReactNode } from 'react';
import Header from './header';
import { usePathname } from 'next/navigation';
import Footer from '../../footer';
import BottomNav from '../../mobilefooter';

type SettingLayoutProps = {
  children: ReactNode;
};

export default function AccountSettingsLayout({
  children,
}: SettingLayoutProps) {
  const path = usePathname();
  const footer = path.startsWith('/users/profile');
  return (
    <div>
      <div className="hidden sm:block">
        <Header />
      </div>
      <div
        className={` ${footer ? 'h-[calc(100vh-55px)] sm:h-[calc(100vh-90px)]' : 'h-full md:h-[calc(100vh-90px)]'}`}
      >
        {children}
      </div>
      {footer && (
        <>
          <div className="hidden sm:block">
            <Footer categories={false} />
          </div>
          <div className="block sm:hidden">
            <BottomNav />
          </div>
        </>
      )}
    </div>
  );
}
