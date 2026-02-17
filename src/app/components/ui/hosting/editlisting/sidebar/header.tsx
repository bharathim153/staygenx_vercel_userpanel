import PageContext from '@/app/components/contextprovider';
import Button from '@/shadcn/ui/Button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { useListingStore } from '../../../create-listings/store';
import { ArrowLeft, Settings } from 'lucide-react';

export default function Header({ value }: { value: string }) {
  const Router = useRouter();
  const { i18 } = useContext(PageContext);
  const { ListingData } = useListingStore();
  const sidebar =
    typeof i18?.EDITLISTING === 'object' ? i18?.EDITLISTING : undefined;

  const [tabs, setTabs] = useState(value);

  const handleTabs = (value: string) => {
    setTabs(value);
    Router.push(`/hosting/listing/editor/${ListingData?.listingId}/${value}`);
  };
  return (
    <div>
      <div>
        <div className="flex gap-4 items-center my-8 px-3">
          <div
            onClick={() => Router.push('/hosting/listing')}
            className="hidden md:flex items-center bg-gray-200 p-3 rounded-full cursor-pointer"
          >
            <ArrowLeft size={18} />
          </div>
          <h1 className="text-[32px] text-semibold">
            {typeof sidebar?.LISTINGEDITOR === 'string'
              ? sidebar.LISTINGEDITOR
              : 'Listing editor'}
          </h1>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="max-w-full md:max-w-[320px] flex flex-col items-center gap-6">
          <div className="flex justify-center gap-3">
            <div className="flex items-center p-1 gap-2 bg-gray-100 rounded-full w-full">
              <Button
                onClick={() => handleTabs('details')}
                className={`transition-colors duration-300 ease-in-out text-sm font-medium px-6 py-2 rounded-full ${tabs === 'details' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
              >
                {typeof sidebar?.TAB_YOURSPACE === 'string'
                  ? sidebar.TAB_YOURSPACE
                  : 'Your space'}
              </Button>
              <Button
                onClick={() => handleTabs('arrival')}
                className={`transition-colors duration-300 ease-in-out text-sm font-medium px-6 py-2 rounded-full ${tabs === 'arrival' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
              >
                {typeof sidebar?.TAB_ARRIVALGUIDE === 'string'
                  ? sidebar.TAB_ARRIVALGUIDE
                  : 'Arrival guide'}
              </Button>
            </div>

            <div className="flex items-center justify-center bg-gray-100 p-1 w-[40px] h-[40px] rounded-full cursor-pointer">
              <Settings size={18} />
            </div>
          </div>
          {/* <div className="bg-white shadow rounded-xl border p-4 space-y-1">
            <div className="flex items-center text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-600 mr-2" />
              {typeof sidebar?.COMPLETE_REQUIRED_STEPS === 'string'
                ? sidebar.COMPLETE_REQUIRED_STEPS
                : 'Complete required steps'}
            </div>
            <p className="text-sm text-gray-600">
              {typeof sidebar?.COMPLETE_REQUIRED_DESCRIPTION === 'string'
                ? sidebar.COMPLETE_REQUIRED_DESCRIPTION
                : 'Finish these final tasks to publish your listing and start getting booked.'}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
