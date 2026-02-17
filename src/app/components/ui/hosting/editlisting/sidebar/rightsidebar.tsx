'use client';
import { useGlobalStore } from '@/lib/store/global-store';

export default function RightSideBar() {
  const { ListingEdit } = useGlobalStore();
  return (
    <div className="h-[calc(100vh_-_80px)] overflow-scroll">
      {ListingEdit?.content}
    </div>
  );
}
