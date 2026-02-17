'use client';
import { useGlobalStore } from '@/lib/store/global-store';
import Sidebar from './sidebar';
import RightSideBar from '@/app/components/ui/hosting/editlisting/sidebar/rightsidebar';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/shadcn/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useListingStore } from '@/app/components/ui/create-listings/store';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ListingEdit, setListingEdit } = useGlobalStore();
  const { ListingData } = useListingStore();
  const Router = useRouter();
  const handleClick = () => {
    if (ListingEdit?.isEdit) {
      setListingEdit({ isEdit: false, content: null });
    } else {
      Router.back();
    }
  };
  const handleClickArrow = () => {
    if (ListingEdit?.isEdit) {
      setListingEdit({ isEdit: false, content: null });
    } else {
      Router.push(`/hosting/listing/editor/${ListingData?.listingId}/details`);
    }
  };
  return (
    <div className="flex h-[calc(100vh_-_80px)] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!ListingEdit?.isEdit && (
          <motion.div
            key="sidebar"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:w-[35%] h-full overflow-auto border-r hidden md:block"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center content remains fixed at 65% */}
      <div
        className={` w-full lg:w-[65%] h-full overflow-auto scrollbar-hide  ${ListingEdit?.isEdit ? 'hidden md:block' : ''}`}
      >
        <div
          className={`px-5 pt-5  ${ListingEdit?.isEdit ? 'mt-3' : 'block md:hidden'}`}
        >
          <Button
            onClick={handleClick}
            variant="gray"
            className="flex items-center gap-2 p-3 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="w-full">{children}</div>
      </div>

      <AnimatePresence mode="wait">
        {ListingEdit?.isEdit && (
          <motion.div
            key="right-sidebar"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:w-[35%] h-full overflow-auto border-l"
          >
            <div className=" pt-5">
              <div>
                <Button
                  onClick={handleClickArrow}
                  variant="gray"
                  className="block md:hidden flex items-center gap-2 p-3 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
              <div className="w-full">
                <RightSideBar />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
