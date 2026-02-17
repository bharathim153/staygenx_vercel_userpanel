'use client';

import MessageList from './messageList';
import Conversation from './converstion';
import ReservationSummary from './resevationSummary';
import { useMessageStore } from './store';
import { useEffect } from 'react';
import useScreenWidth from '@/hooks/useScreenWidth';
import { useDrawerStore } from '@/lib/store/drawer-store';
import { useDialogStore } from '@/lib/store/dialog-store';

export default function Inbox() {
  const {
    reservationSection,
    setReserveSection,
    conversation,
    setconversation,
    messageList,
    setMessageList,
  } = useMessageStore();
  const { openDrawer, name } = useDrawerStore();
  const { openDialog, name: dialogName } = useDialogStore();

  const screen = useScreenWidth();
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;

  const chatId = searchParams?.get('chatId') ?? null;
  const details = searchParams?.get('details') ?? null;

  useEffect(() => {
    if (chatId) {
      setconversation(true);
      if (details) {
        setReserveSection(true);
        setMessageList(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (screen.width && screen.width < 1120 && details === null) {
      setReserveSection(false);
    }
    if (screen.width && screen.width < 768 && chatId !== null) {
      openDrawer('conversation');
    } else if (
      screen.width &&
      screen.width > 768 &&
      chatId !== null &&
      name === 'conversation'
    ) {
      openDrawer('');
    } else if (
      screen.width &&
      screen.width > 768 &&
      chatId !== null &&
      dialogName === 'details'
    ) {
      openDialog('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);
  return (
    <div className="h-[calc(100vh_-_90px)] w-full flex">
      {messageList && <MessageList />}
      {conversation && chatId && (
        <>
          {screen?.width && screen?.width > 768 && <Conversation />}
          {reservationSection && screen?.width && screen?.width > 768 && (
            <ReservationSummary />
          )}
        </>
      )}
    </div>
  );
}
