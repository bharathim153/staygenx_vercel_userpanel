'use client';
import { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import { ListingProvider } from './ListingContext';

type SettingLayoutProps = {
  children: ReactNode;
};

export default function CreateListingLayout({ children }: SettingLayoutProps) {
  // const path = usePathname();
  // const footer = path.startsWith('/users/profile');
  return (
    <ListingProvider>
      <div>
        <Header />
        <div className="h-[calc(100vh_-_200px)] overflow-y-auto py-[20px] px-[220px]">
          {children}
        </div>
        <Footer />
      </div>
    </ListingProvider>
  );
}
