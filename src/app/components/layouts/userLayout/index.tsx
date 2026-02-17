'use client';
import { ReactNode } from 'react';
import Header from './header';
import Footer from '../../footer';
import BottomNav from '../../mobilefooter';
import { usePathname } from 'next/navigation';

type GuestLayoutProps = {
  children: ReactNode;
};

export default function UserLayout({ children }: GuestLayoutProps) {
  const path = usePathname();
  const isFooter = path.startsWith('/message');
  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      {children}
      <BottomNav />
      {!isFooter && (
        <>
          <Footer categories={false} />
        </>
      )}
    </>
  );
}
