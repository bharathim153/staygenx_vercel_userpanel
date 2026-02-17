import Button from '@/shadcn/ui/Button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export type GuestType = 'adults' | 'children' | 'infants' | 'pets';

interface GuestItem {
  label: string;
  subtitle: string;
  type: GuestType;
}

const guestItems: GuestItem[] = [
  { label: 'Adults', subtitle: 'Ages 13 or above', type: 'adults' },
  { label: 'Children', subtitle: 'Ages 2–12', type: 'children' },
  { label: 'Infants', subtitle: 'Under 2', type: 'infants' },
  { label: 'Pets', subtitle: 'Bringing a service animal?', type: 'pets' },
];

interface GuestSelectorProps {
  counts: Record<GuestType, number>;
  onChange: React.Dispatch<React.SetStateAction<Record<GuestType, number>>>;
  isSearchBar?: boolean;
}

export default function GuestSelector({
  counts,
  onChange,
  isSearchBar = false,
}: GuestSelectorProps) {
  const initialCounts = {
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  };
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateCount = (type: GuestType, delta: number) => {
    onChange(prev => {
      const next = {
        ...prev,
        [type]: Math.max(0, prev[type] + delta),
      };
      if(!isSearchBar) {    
      const params = new URLSearchParams(searchParams.toString());

      (Object.keys(next) as GuestType[]).forEach(key => {
        if (next[key] > 0) {
          params.set(key, String(next[key]));
        } else {
          params.delete(key);
        }
      });

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

      return next;
    });
  };

  return (
    <div>
      {guestItems.map((item, index) => (
        <div
          key={item.type}
          className={`flex justify-between items-center ${
            index === guestItems.length - 1 ? '' : 'border-b'
          } py-4`}
        >
          <div>
            <div className="text-base font-medium">{item.label}</div>
            <div className="text-sm text-gray-500">
              {item.type === 'pets' ? (
                <a href="#" className="underline">
                  {item.subtitle}
                </a>
              ) : (
                item.subtitle
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => updateCount(item.type, -1)}
              disabled={counts[item.type] === initialCounts[item.type]}
              className="w-8 h-8 rounded-full border text-xl disabled:opacity-30"
            >
              −
            </Button>

            <span>{counts[item.type]}</span>

            <Button
              onClick={() => updateCount(item.type, 1)}
              className="w-8 h-8 rounded-full border text-xl"
            >
              +
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
