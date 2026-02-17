'use client';

import { useProfileStore } from './ui/homepage/store/user';
import Image from 'next/image';

export default function UserProfile({
  className = 'w-9 h-9 text-[12px]',
  withname = false,
}: {
  className?: string;
  withname?: boolean;
}) {
  const { profileData } = useProfileStore();
  return (
    <div
      className={`${withname ? 'flex flex-col items-center justify-center gap-4 my-8' : ''}`}
    >
      {profileData?.userinfo?.profileImage ? (
        <div className={` ${className} `}>
          <Image
            src={
              process.env.NEXT_PUBLIC_IMAGE_URL +
              profileData?.userinfo?.profileImage
            }
            alt="img"
            width={800}
            height={800}
            className={`${className} rounded-full object-cover`}
          />
        </div>
      ) : (
        <div
          className={` ${className} flex items-center justify-center bg-[#000] p-2 rounded-full cursor-pointer font-semibold text-white`}
        >
          {`${profileData?.firstName[0] ?? ''}${profileData?.lastName[0] ?? ''}`.toUpperCase()}
        </div>
      )}

      {withname && (
        <p className="text-[#202020DB]">
          {profileData?.firstName} {profileData?.lastName}
        </p>
      )}
    </div>
  );
}
