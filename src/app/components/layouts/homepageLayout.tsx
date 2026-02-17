import { ReactNode } from 'react';
import Header from '../header';
import Footer from '../footer';
import SearchSection from '../header/searchbarcomponents/searchsection';
import BottomNav from '../mobilefooter';

type HomepageLayoutProps = {
  children: ReactNode;
};

export default function HomepageLayout({ children }: HomepageLayoutProps) {
  return (
    <>
      <Header centerComp={<SearchSection />} />
      {children}
      <BottomNav />
      <Footer />
    </>
  );
}
