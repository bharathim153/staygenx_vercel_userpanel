import { useGlobalStore } from '@/lib/store/global-store';
import Button from '@/shadcn/ui/Button';
import { MessageSquare, X } from 'lucide-react';

export default function SuccessHeader() {
  const { setSuccessHeader, successHeader } = useGlobalStore();
  return (
    <div className="fixed w-full top-0 inset-x-0 flex justify-center z-50">
      <div className="bg-teal-100 text-teal-900 px-6 py-4 shadow-md flex items-center gap-4  w-full mx-4 md:mx-0">
        <div className="text-2xl">
          <MessageSquare />
        </div>
        <span className="flex-1 text-sm sm:text-base">
          {successHeader?.content ?? ''}{' '}
          <strong>{successHeader?.email ?? ''}</strong>.
        </span>
        <Button
          className="text-teal-900 hover:text-teal-700 text-xl focus:outline-none"
          onClick={() =>
            setSuccessHeader({
              header: false,
              content: '',
              email: '',
            })
          } // your close handler
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
