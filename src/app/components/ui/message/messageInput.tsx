'use client';

import { useForm } from 'react-hook-form';
import { ArrowUp } from 'lucide-react';
import { useConversationStore } from './store/conversation';
import Button from '@/shadcn/ui/Button';

type FormValues = {
  message: string;
};

export default function MessageInput() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { setConversation } = useConversationStore();

  const onSubmit = (data: FormValues) => {
    setConversation({ message: data.message });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-3xl mx-auto px-4 space-y-2"
    >
      <div className="text-sm text-gray-500 flex items-center gap-1">
        Typical response time: 20 minutes
      </div>

      <div className="flex items-center border rounded-2xl p-3 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500">
        <input
          {...register('message', { required: true })}
          placeholder="Type your message..."
          className="flex-1 resize-none outline-none border-none bg-transparent text-sm placeholder-gray-400"
        />
        <Button variant="black" type="submit" className="p-2 rounded-full">
          <ArrowUp size={16} color="#fff" />
        </Button>
      </div>
    </form>
  );
}
