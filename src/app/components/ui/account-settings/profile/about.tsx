'use client';
import UserProfile from '@/app/components/userProfile';
import { useDrawerStore } from '@/lib/store/drawer-store';
import { MessageSquare } from 'lucide-react';
import { useContext, useEffect } from 'react';
import { useProfileStore } from '../../homepage/store/user';
import PageContext from '@/app/components/contextprovider';
import Button from '@/shadcn/ui/Button';

export default function AboutUI() {
  const { openDrawer } = useDrawerStore();
  const { profileData } = useProfileStore();
  const { i18 } = useContext(PageContext);
  const Profile =
    typeof i18?.HOMEPAGE?.HEADER?.PROFILEPAGE === 'object'
      ? i18?.HOMEPAGE?.HEADER?.PROFILEPAGE
      : undefined;
  const Common = typeof i18?.COMMON === 'object' ? i18?.COMMON : undefined;

  const handleClick = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('editMode', 'true');
    window.history.replaceState({}, '', url.toString());
    openDrawer('profileEdit');
  };
  const handleStart = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('editMode', 'true');
    window.history.replaceState({}, '', url.toString());
    openDrawer('profileEdit');
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('editMode') === 'true') {
        openDrawer('profileEdit');
      }
    }
  }, [openDrawer]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="justify-between flex items-center  gap-4">
        <h1 className="text-2xl font-bold">
          {typeof Profile?.ABOUTME === 'string' ? Profile.ABOUTME : 'About me'}
        </h1>
        <Button
          variant="gray"
          onClick={handleClick}
          className="px-6 py-2  rounded-full text-md font-medium border"
        >
          {typeof Common?.EDIT === 'string' ? Common.EDIT : 'Edit'}
        </Button>
      </div>

      {/* Main Card Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border">
          <UserProfile className="w-24 h-24 text-[32px]" />
          <h2 className="text-xl font-semibold mt-4">
            {profileData?.firstName ?? ''}
          </h2>
        </div>

        {/* Profile Completion Prompt */}
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-semibold mb-2">
            {typeof Profile?.COMPLETEYOURPROFILE === 'string'
              ? Profile.COMPLETEYOURPROFILE
              : 'Complete your profile'}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {typeof Profile?.PROFILEDESC === 'string'
              ? Profile.PROFILEDESC
              : 'Your Staygenx profile is an important part of every reservation.Create yours to help other hosts and guests get to know you.'}
          </p>
          <Button
            variant="black"
            onClick={handleStart}
            className=" text-white px-6 py-2 rounded-lg font-semibold w-fit cursor-pointer"
          >
            {typeof Profile?.GETSTARTED === 'string'
              ? Profile.GETSTARTED
              : 'Get started'}
          </Button>
        </div>
      </div>

      {/* Divider */}
      <hr />

      {/* Reviews Section */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        <span className="font-medium">
          {typeof Profile?.REVIEW === 'string'
            ? Profile.REVIEW
            : 'Reviews I’ve written'}
        </span>
      </div>
    </div>
  );
}
