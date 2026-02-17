import { useMessageStore } from './store';
import { useDrawerStore } from '@/lib/store/drawer-store';
import useScreenWidth from '@/hooks/useScreenWidth';
import UserProfile from '../../userProfile';
import Button from '@/shadcn/ui/Button';
import Image from 'next/image';

export default function MessageList() {
  const { setconversation } = useMessageStore();
  const { openDrawer } = useDrawerStore();
  const screen = useScreenWidth();
  const handleClick = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('chatId', '12345');
    window.history.replaceState({}, '', url.toString());
    if (screen?.width && screen?.width < 768) {
      openDrawer('conversation');
    } else {
      setconversation(true);
    }
  };
  return (
    <aside className="w-full md:w-[350px] border-r p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Messages</h2>
      <div className="flex gap-2">
        <Button className="bg-black text-white px-3 py-1 rounded-full text-sm">
          All
        </Button>
        <Button className="px-3 py-1 rounded-full text-sm border">
          Unread
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {/* Message Preview */}
        <div
          onClick={handleClick}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 cursor-pointer"
        >
          <div className="relative">
            <Image
              src="/images/default.jpg"
              width={100}
              height={100}
              className="rounded-lg w-[70px] h-[60px]"
              alt="user"
            />
            <UserProfile />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium truncate">
              Sowmya Behara, Vaibhav
            </p>
            <p className="text-xs text-gray-500 truncate">
              Enquiry sent · 25–27 Jul · Anjuna
            </p>
          </div>
          <span className="text-xs text-gray-400">12:16 PM</span>
        </div>
      </div>
    </aside>
  );
}
