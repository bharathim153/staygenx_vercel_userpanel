'use client';
import Logo from '../../logo';
import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SingleListing } from '@/services/listing/getapis';
import Button from '@/shadcn/ui/Button';
import { useListingStore } from '../../ui/create-listings/store';

export default function Header() {
  const pathname = usePathname();
  const Router = useRouter();
  const { isInitial } = useListingStore();
  const extractedId: string = useMemo(() => {
    const parts = pathname.split('/');
    return parts[2] !== 'overview' ? parts[2] : '';
  }, [pathname]);

  const enable = extractedId !== '' && isInitial;

  useEffect(() => {
    if (enable) SingleListing({ listingId: extractedId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex px-[74px] py-[24px] justify-between  w-full bg-[#fff]">
      <Logo />

      <Button
        variant="gray"
        onClick={() => Router.push(`/hosting/listing`)}
        className="px-6 py-2 rounded-full cursor-pointer"
      >
        Exit
      </Button>
    </div>
  );
}
