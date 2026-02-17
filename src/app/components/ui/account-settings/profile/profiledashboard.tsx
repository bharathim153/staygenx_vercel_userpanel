'use client';
import { useEffect, useState } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import AboutUI from './about';
import SettingsMenu from './settingsmenu';
import { useDrawerStore } from '@/lib/store/drawer-store';
import UserProfile from '@/app/components/userProfile';
import { useProfileStore } from '../../homepage/store/user';
import Button from '@/shadcn/ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ProfileDashboard = () => {
  const { openDrawer } = useDrawerStore();
  const Router = useRouter();
  const { profileData } = useProfileStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // ✅ detect page scroll
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  console.log('scrolled', scrolled);
  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-col md:hidden max-w-md mx-auto min-h-screen">
        <div className="flex-1 p-4 space-y-6 relative">
          <div className="flex justify-between">
            <h1 className="text-[32px] font-bold">Profile</h1>
            <div className="w-9 h-9 flex items-center bg-gray-200 justify-center rounded-full cursor-pointer">
              <Bell size={18} />
            </div>
          </div>

          {/* Profile Card */}
          <Button
            onClick={() => openDrawer('about')}
            className="w-full shadow-md rounded-2xl p-6 flex flex-col items-center text-center border cursor-pointer"
          >
            <UserProfile className="w-20 h-20" />
            <h2 className="text-xl font-semibold mt-4">
              {profileData?.firstName ?? ''}
            </h2>
          </Button>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard image="/images/trip.avif" label="Past trips" />
            <FeatureCard image="/images/connect.avif" label="Connections" />
          </div>

          {/* Become a Host */}
          <Button className="w-full shadow-md rounded-2xl p-4 flex items-center gap-4 border cursor-pointer">
            <Image
              src="/images/host.png"
              alt="Become a host"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <div className="flex flex-col items-start">
              <p className="font-semibold">Become a host</p>
              <p className="text-sm text-gray-600">
                It’s easy to start hosting and earn extra income.
              </p>
            </div>
          </Button>

          <SettingsMenu />
        </div>

        {/* Floating bottom button */}
        <div
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 transition-transform duration-300 z-50 
            ${scrolled ? '[transform:translateY(-40px)]' : 'translate-y-0'}`}
          onClick={() => Router.push('/hosting/today')}
        >
          <Button
            variant="black"
            className="px-8 py-4 rounded-full shadow-lg text-sm flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Switch to hosting
          </Button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        <AboutUI />
      </div>
    </>
  );
};

// Reusable feature card
const FeatureCard = ({ image, label }: { image: string; label: string }) => (
  <Button className="relative shadow-md rounded-2xl p-4 flex flex-col items-center justify-center border h-[188px] cursor-pointer">
    <Image src={image} alt={label} width={120} height={120} />
    <p className="mt-3 font-medium">{label}</p>
  </Button>
);

export default ProfileDashboard;
