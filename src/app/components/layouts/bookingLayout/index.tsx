import { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

type BookingLayoutProps = {
  children: ReactNode;
};

export default function BookingLayout({ children }: BookingLayoutProps) {
  return (
    <div className="h-[100%]">
      <div className="hidden sm:block">
        <Header />
      </div>
      <div
        style={{
          height: 'calc(100% - 70px)',
        }}
      >
        {children}
      </div>
      <div className="hidden sm:block" style={{
        position: "fixed",
        bottom: 0,
        width: "100%"
      }}>
        <Footer />
      </div>
    </div>
  );
}
