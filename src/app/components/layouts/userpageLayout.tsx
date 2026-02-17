import { ReactNode } from 'react';
import Header from '../header';
import Footer from '../footer';
import SearchSection from '../header/searchbarcomponents/searchsection';

type GuestLayoutProps = {
  children: ReactNode;
};

export default function UserpageLayout({ children }: GuestLayoutProps) {
  return (
    <>
      <div className="hidden md:block">
        <Header
          maxWidth="max-w-6xl"
          sticky={false}
          centerComp={<SearchSection animate={false} />}
        />
      </div>
      {children}
      <Footer categories={false} />
    </>
  );
}
