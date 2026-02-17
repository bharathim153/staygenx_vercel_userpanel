import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isSameDay } from 'date-fns';
import './calendar.css';
import useScreenWidth from '@/hooks/useScreenWidth';
import { isDateBlocked } from '@/lib/utils';

type DateRange = [Date | null, Date | null];

import { BlockedDate } from '../../ui/hosting/store/blockdates';

interface CalendarProps {
  onChangeDate: (values: DateRange) => void;
  monthsShown?: number;
  selectedDates?: DateRange;
  roomData?: { blockedDates?: BlockedDate[] };
}

export default function Calendar({
  onChangeDate,
  monthsShown = 2,
  selectedDates,
  roomData,
}: CalendarProps) {
  const [dateRange, setDateRange] = useState<DateRange>([null, null]);
  const [startDate, endDate] = dateRange;
  const [isClient, setIsClient] = useState(false);
  const screen = useScreenWidth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (updates: DateRange) => {
    setDateRange(updates);
    onChangeDate(updates);
  };

  useEffect(() => {
    setDateRange(selectedDates ?? [null, null]);
  }, [selectedDates]);
  return (
    <div>
      {isClient && (
        <DatePicker
          selectsRange
          swapRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update: DateRange) => handleChange(update)}
          monthsShown={screen?.width && screen?.width < 850 ? 1 : monthsShown}
          inline
          minDate={new Date()}
          filterDate={(date: Date) =>
            !isDateBlocked(date, roomData?.blockedDates || [])
          }
          dayClassName={(date: Date) => {
            if (isDateBlocked(date, roomData?.blockedDates || [])) {
              return 'blocked-date';
            }
            if (startDate && isSameDay(date, startDate))
              return 'custom-range-start';
            if (endDate && isSameDay(date, endDate)) return 'custom-range-end';
            if (startDate && endDate && date > startDate && date < endDate)
              return 'custom-in-range';
            return '';
          }}
        />
      )}
    </div>
  );
}
