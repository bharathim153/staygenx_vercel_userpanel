'use client';

import { useEffect, useState } from 'react';
import Calendar from '../../header/searchbarcomponents/calendar';
import { format } from 'date-fns';

type DateRange = [Date | null, Date | null];

interface CalendarSectionProps {
  roomData?: Record<string, unknown>;
}

export default function CalendarSection({ roomData }: CalendarSectionProps) {
  const [date, setDate] = useState<DateRange>([null, null]);
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;

  const StartDate = searchParams?.get('startDate') ?? '';
  const EndDate = searchParams?.get('endDate') ?? '';

  const onChangeDate = (values: DateRange) => {
    if (values) {
      setDate(values);
    }
  };

  useEffect(() => {
    if (date[0] && date[1]) {
      const url = new URL(window.location.href);
      url.searchParams.set('startDate', date[0].toISOString());
      url.searchParams.set('endDate', date[1].toISOString());
      window.history.replaceState({}, '', url.toString());
    }
  }, [date]);

  useEffect(() => {
    if (StartDate && EndDate) {
      setDate([new Date(StartDate), new Date(EndDate)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Select check-in date</h2>
      <span>Add your travel dates for exact pricing</span>
      <>
        <p className="text-[#6a6a6a]">
          {date[0] ? format(new Date(date[0]), 'dd MMM yyyy') : 'No start date'}
          {date[1] ? ` - ${format(new Date(date[1]), 'dd MMM yyyy')}` : ''}
        </p>

        <div className="flex justify-center">
          <Calendar
            onChangeDate={onChangeDate}
            selectedDates={date}
            monthsShown={2}
            roomData={roomData}
          />
        </div>
      </>
    </div>
  );
}
