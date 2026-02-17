import { ReactNode } from 'react';
import Header from './header';
import BottomNav from './footer';
import ActionFooter from '../../ui/hosting/actionFooter';

type HomepageLayoutProps = {
  children: ReactNode;
};

export default function HostingLayout({ children }: HomepageLayoutProps) {
  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="mt-0 md:mt-[100px] h-[calc(100vh-80px)]"> {children}</div>
      <div>
        <ActionFooter />
        <BottomNav />
      </div>
    </>
  );
}
