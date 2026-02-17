'use client';

import ReusableDrawer from '@/shadcn/ui/drawer';
import { useDrawerStore } from '@/lib/store/drawer-store';
import SearchDrawer from './dialogs/searchbar';
import EditProfile from './dialogs/editprofile';
import AboutUI from './ui/account-settings/profile/about';
import Conversation from './ui/message/converstion';
import ListingPhotos from './dialogs/listingphotos';
import ActionHeader from './ui/hosting/actionHeader';

export default function GlobalDrawer() {
  const { name, closeDrawer, openDrawer } = useDrawerStore();

  return (
    <>
      <ReusableDrawer
        open={name === 'searchbar'}
        onOpenChange={closeDrawer}
        title=""
        side="top"
        className="bg-[#F7F7F7]"
      >
        <SearchDrawer />
      </ReusableDrawer>

      <ReusableDrawer
        open={name === 'profileEdit'}
        onOpenChange={() => {
          openDrawer('');
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('editMode');
            window.history.replaceState({}, '', url.toString());
          }
        }}
        title=""
        side="right"
        className="bg-[#F7F7F7]"
      >
        <EditProfile />
      </ReusableDrawer>

      <ReusableDrawer
        open={name === 'about'}
        onOpenChange={closeDrawer}
        title=""
        side="right"
        className=""
      >
        <AboutUI />
      </ReusableDrawer>

      <ReusableDrawer
        open={name === 'conversation'}
        onOpenChange={() => {}}
        title=""
        side="right"
        className=""
        noTitle={true}
      >
        <Conversation />
      </ReusableDrawer>

      <ReusableDrawer
        open={name === 'listingphotos'}
        onOpenChange={() => {}}
        title=""
        side="right"
        className="h-[calc(100vh_-_89px)]"
        noTitle={true}
      >
        <ListingPhotos />
      </ReusableDrawer>

      <ReusableDrawer
        open={name === 'actionDrawer'}
        onOpenChange={() => closeDrawer()}
        title=""
        side="bottom"
        className=""
      >
        <ActionHeader />
      </ReusableDrawer>
    </>
  );
}
