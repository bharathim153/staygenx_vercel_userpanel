import { ChevronLeft } from 'lucide-react';
import { useMessageStore } from './store';
import { useDrawerStore } from '@/lib/store/drawer-store';
import useScreenWidth from '@/hooks/useScreenWidth';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useConversationStore } from './store/conversation';
import MessageInput from './messageInput';
import Button from '@/shadcn/ui/Button';

export default function Conversation() {
  const { reservationSection, setReserveSection, setMessageList } =
    useMessageStore();
  const { conversation } = useConversationStore();
  const { openDrawer } = useDrawerStore();
  const { openDialog } = useDialogStore();
  const screen = useScreenWidth();
  const handleClick = () => {
    openDrawer('');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('chatId');
      url.searchParams.delete('details');
      window.history.replaceState({}, '', url.toString());
      setMessageList(true);
    }
  };
  return (
    <main className="h-[calc(100vh_-_280px)] md:h-full flex flex-1  flex-col border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="block md:hidden">
          <Button
            onClick={handleClick}
            className="p-2 bg-gray-100 rounded-full "
          >
            <ChevronLeft size={18} />
          </Button>
        </div>
        <div className="">
          <p className="font-medium">Sowmya Behara, Vaibhav</p>
          <p className="text-xs text-gray-400">Translation on</p>
        </div>
        {!reservationSection ? (
          <Button
            onClick={() => {
              if (
                screen?.width !== undefined &&
                screen?.width &&
                screen?.width < 1120
              ) {
                if (
                  screen?.width !== undefined &&
                  screen?.width &&
                  screen?.width < 768
                ) {
                  openDialog('details');
                } else {
                  const url = new URL(window.location.href);
                  url.searchParams.set('details', 'true');
                  window.history.replaceState({}, '', url.toString());
                  setReserveSection(!reservationSection);
                  setMessageList(false);
                }
              }
              setReserveSection(!reservationSection);
            }}
            className="p-3 bg-gray-100 rounded-full text-[14px] font-semibold"
          >
            <p className="hidden md:block"> Show reservation</p>
            <p className="block md:hidden">Details</p>
          </Button>
        ) : (
          <div></div>
        )}
      </div>

      <div className=" h-screen flex-1 overflow-y-auto p-4">
        <div className="text-center text-sm text-gray-500 mb-6">
          Your enquiry for 1 guest on 25–27 Jul has been sent.
        </div>
        <div className="flex  justify-end">
          <div className="flex flex-col gap-4 text-center">
            {Array.isArray(conversation) &&
              conversation.map((items, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-800 text-white px-6 py-3 rounded-t-xl rounded-bl-xl text-sm"
                  >
                    {items?.message}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full p-4 border-t md:static md:bottom-auto">
        <MessageInput />
      </div>
    </main>
  );
}
