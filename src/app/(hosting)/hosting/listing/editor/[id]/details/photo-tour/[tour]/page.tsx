'use client';
import { useParams } from 'next/navigation';
import TourComp from '@/app/components/ui/hosting/editlisting/tour';

export default function Tour() {
  const { tour } = useParams(); // get the dynamic slug from the URL
  return <TourComp tour={tour as string} />;
}
