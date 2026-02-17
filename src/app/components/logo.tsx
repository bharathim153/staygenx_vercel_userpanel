'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useProfileStore } from './ui/homepage/store/user';
import { getCookie } from '@/utils/helper';
import Image from 'next/image';

export default function Logo({ mobile = false }: { mobile?: boolean }) {
  const Router = useRouter();
  const { fetchProfile, profileData } = useProfileStore();
  const userId = getCookie('appUserId');

  useEffect(() => {
    if (userId && profileData === null) fetchProfile({ body: { userId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" cursor-pointer" onClick={() => Router.push('/')}>
      {!mobile && (
        <Image
          src="/svg/logo2.svg"
          alt="logo"
          width={170}
          height={70}
          className="hidden md:block w-[170px] h-[70px]"
        />
      )}
      <Image
        src="/svg/logomob.svg"
        alt="logo"
        width={170}
        height={70}
        className={`${mobile ? 'w-[40px] h-[40px]' : 'block w-[40px] h-[70px] md:hidden'}`}
      />
    </div>
  );
}
