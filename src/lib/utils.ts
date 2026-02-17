import { BlockedDate } from '@/app/components/ui/hosting/store/blockdates';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeDate = (date?: Date): string => {
  if (!(date instanceof Date)) return '';
  return date.toISOString().split('T')[0];
};

export const isDateBlocked = (
  date: Date,
  blockedDates: BlockedDate[]
): boolean => {
  const target = normalizeDate(date);

  return blockedDates.some(item => {
    const start = normalizeDate(new Date(item.startDate));
    const end = normalizeDate(new Date(item.endDate));
    return target >= start && target <= end;
  });
};

export function formatTitle(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}
