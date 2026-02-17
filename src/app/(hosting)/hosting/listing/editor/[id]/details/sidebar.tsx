'use client';
import ListEditingSidebar from '@/app/components/ui/hosting/editlisting/sidebar';
import PhotoTourSidebar from '@/app/components/ui/hosting/editlisting/sidebar/phototoursidebar';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const parts = pathname.split('/');
  return parts.length > 7 ? <PhotoTourSidebar /> : <ListEditingSidebar />;
}
