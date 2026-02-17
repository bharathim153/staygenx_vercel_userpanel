import { ReactNode } from 'react';
import Header from '../header';
import Footer from '../footer';
import SearchSection from '../header/searchbarcomponents/searchsection';

type GuestLayoutProps = {
  children: ReactNode;
};

export default function GuestpageLayout({ children }: GuestLayoutProps) {
  return (
    <>
      <Header centerComp={<SearchSection animate={false} filter={true} />} />
      {children}
      <Footer categories={false} />
    </>
  );
}
