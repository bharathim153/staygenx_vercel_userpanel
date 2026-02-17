'use client';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import TabsComponent from '@/shadcn/ui/tabs';
import { Search, SearchIcon, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalStore } from '@/lib/store/global-store';
import SearchBar from '../../ui/searchbar';
import { useDrawerStore } from '@/lib/store/drawer-store';
import Button from '@/shadcn/ui/Button';
import PageContext from '../../contextprovider';

export default function SearchSection({
  animate = true,
  filter = false,
}: {
  animate?: boolean;
  filter?: boolean;
}) {
  const { openSearch, setOpenSearch } = useGlobalStore();
  const { openDrawer } = useDrawerStore();
  const { i18 } = useContext(PageContext);
  const Searchbar =
    typeof i18?.HOMEPAGE?.HEADER?.SEARCHBAR === 'object'
      ? i18?.HOMEPAGE?.HEADER?.SEARCHBAR
      : undefined;
  // Force animation to play on every page load by using a unique key
  const [iconKey, setIconKey] = useState(0);
  useEffect(() => {
    setIconKey(Date.now());
  }, []);

  const tabData = [
    {
      label: (
        <span className="flex items-center gap-2">
          {/* Animated earth circle with rotating home icon */}
          {/* <span className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white w-15 h-15 shadow-sm"> */}
          <motion.img
            key={iconKey}
            src="/images/home_icon.png"
            alt="Home"
            className="w-12 h-12"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ display: 'inline-block' }}
          />
          {/* </span> */}
          {typeof Searchbar?.HOMES === 'string' ? Searchbar.HOMES : 'Homes'}
        </span>
      ),
      value: 'homes',
      content: (
        <div className="flex items-center justify-center">
          <SearchBar />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!animate) return;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100 && openSearch) {
        setOpenSearch(false);
      } else if (scrollTop <= 0 && !openSearch) {
        setOpenSearch(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [openSearch, animate, setOpenSearch]);

  useLayoutEffect(() => {
    setOpenSearch(animate);
  }, [animate, setOpenSearch]);
  return (
    <>
      <div className="hidden md:flex mx-4 gap-4  ">
        {!openSearch ? (
          <motion.div
            key="search-closed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.1 }}
            onClick={() => setOpenSearch(true)}
            className="border flex items-center bg-white shadow-md rounded-full px-4 py-2 space-x-4 cursor-pointer transition"
          >
            <span className="font-semibold text-sm text-gray-800">
              {typeof Searchbar?.ANYWHERE === 'string'
                ? Searchbar.ANYWHERE
                : 'Anywhere'}
            </span>
            <div className="h-6 w-px bg-gray-300" />
            <span className="text-sm text-gray-700 font-medium hidden sm:block">
              {typeof Searchbar?.ANYTIME === 'string'
                ? Searchbar.ANYTIME
                : 'Anytime'}
            </span>
            <div className="h-6 w-px bg-gray-300 hidden sm:block" />
            <span className="text-sm text-gray-700 font-medium block">
              {typeof Searchbar?.ADDGUEST === 'string'
                ? Searchbar.ADDGUEST
                : 'Add guests'}
            </span>
            <Button
              variant="pink"
              className="ml-auto text-white p-2 rounded-full transition"
            >
              <Search size={16} />
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              key="search-tabs"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block w-full "
            >
              <div className="relative w-full flex">
                <TabsComponent
                  tabs={tabData}
                  defaultValue="homes"
                  className="w-full"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        {!openSearch && filter && (
          <div className="flex gap-3 items-center px-4 py-2 border border-gray-200 rounded-full hidden md:flex">
            <SlidersHorizontal size={18} />
            <p className="text-sm text-gray-700 font-medium">
              {typeof Searchbar?.FILTERS === 'string'
                ? Searchbar.FILTERS
                : 'Filters'}
            </p>
          </div>
        )}
      </div>
      <Button
        onClick={() => openDrawer('searchbar')}
        className="block md:hidden p-4  shadow-lg border border-gray-200 rounded-full flex gap-3 items-center justify-center w-full"
        variant="pink"
      >
        <SearchIcon className="w-[15px] h-[15px]" />
        <p>
          {typeof Searchbar?.SEARCH === 'string'
            ? Searchbar.SEARCH
            : 'start your search'}
        </p>
      </Button>
    </>
  );
}
