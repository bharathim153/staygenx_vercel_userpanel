import CalendarComp from '@/app/components/ui/hosting/calendar';
import { Suspense } from 'react';

export default function TodayPage() {
  return (
    <Suspense fallback={<div>Loading calendar...</div>}>
      <CalendarComp />
    </Suspense>
  );
}
