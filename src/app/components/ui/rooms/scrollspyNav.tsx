'use client';
import Button from '@/shadcn/ui/Button';
import { useEffect, useState } from 'react';
import { useEstimationStore } from '../booking/store/estimation';
import { DateRange } from './reservation';
import { GuestType } from '../../header/searchbarcomponents/guestselector';
import { useRouter, useSearchParams } from 'next/navigation';

const sections = [
  { id: 'photos', label: 'Photos' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' },
];

export interface fare {
  weekdayBasePrice: number;
  listingId?: string;
}

export default function ScrollSpyNav({ weekdayBasePrice, listingId }: fare) {
  const Router = useRouter();
  const { estimationData, loading } = useEstimationStore();
  const [active, setActive] = useState('photos');
  const [navVisible, setNavVisible] = useState(false);
  const [showReserveButton, setShowReserveButton] = useState(false);
  const [date, setDate] = useState<DateRange>([null, null]);
  const [guestCounts, setGuestCounts] = useState<Record<GuestType, number>>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const searchParams = useSearchParams();

  const StartDate = searchParams?.get('startDate') ?? '';
  const EndDate = searchParams?.get('endDate') ?? '';
  const adult = searchParams?.get('adults') ?? '';
  const children = searchParams?.get('children') ?? '';
  const infant = searchParams?.get('infants') ?? '';
  const pet = searchParams?.get('pets') ?? '';
  const handleClick = () => {
    Router.push(`/book/${listingId}?${searchParams.toString()}`);
  };
  useEffect(() => {
    const photoEl = document.getElementById('photos');
    if (!photoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(photoEl);
    return () => observer.disconnect();
  }, []);

  // Highlight active section
  useEffect(() => {
    const spyObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      {
        rootMargin: '-110px 0px -50%',
        threshold: 0.3,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) spyObserver.observe(el);
    });

    return () => spyObserver.disconnect();
  }, []);

  // Show reserve Button when original scrolls into navbar area
  useEffect(() => {
    const target = document.getElementById('reservation-Button'); // Add this ID below
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowReserveButton(!entry.isIntersecting);
      },
      {
        rootMargin: '-80px 0px 0px 0px', // Trigger when the original Button moves under sticky navbar
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = -90;
      const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    if (StartDate && EndDate) {
      setDate([new Date(StartDate), new Date(EndDate)]);
    }
    if (adult || children) {
      const ad = adult ? parseInt(adult, 10) : 1;
      const ch = children ? parseInt(children, 10) : 0;
      const inf = infant ? parseInt(infant, 10) : 0;
      const petc = pet ? parseInt(pet, 10) : 0;
      setGuestCounts({
        adults: ad,
        children: ch,
        infants: inf,
        pets: petc,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!navVisible) return null;
  return (
    <div className="hidden md:block sticky top-0 z-50 bg-white shadow-sm ">
      <div className="flex justify-between items-center px-6 py-3 transition max-w-6xl mx-auto">
        <div className="flex gap-6">
          {sections.map(({ id, label }) => (
            <Button
              key={id}
              onClick={() => scrollTo(id)}
              className={`font-medium transition cursor-pointer ${
                active === id ? 'text-black' : 'text-gray-500'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Animated Reserve Button */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showReserveButton
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="text-start text-sm">
              {loading ? (
                <div className="flex items-center gap-2 animate-pulse mb-4">
                  {/* price skeleton */}
                  <div className="h-7 w-24 bg-gray-200 rounded" />
                  {/* text skeleton */}
                  <div className="h-5 w-20 bg-gray-200 rounded" />
                </div>
              ) : (
                <div className="text-sm font-medium text-gray-800 ">
                  {estimationData !== null && estimationData?.subtotal ? (
                    <div>
                      <span className="text-lg font-bold">
                        {' '}
                        {estimationData?.subtotal}
                      </span>{' '}
                      for {estimationData?.nights}{' '}
                      {estimationData?.nights > 1 ? 'nights' : 'night'}
                    </div>
                  ) : (
                    <span className="text-lg font-bold">
                      {weekdayBasePrice}
                    </span>
                  )}{' '}
                  {/* <span className="text-base">for 2 nights</span> */}
                </div>
              )}
              {/* <p className="text-gray-600">for 2 nights</p> */}
              <p className="text-sm">⭐ 5.0 · 6 reviews</p>
            </div>
            <Button
              variant="pink"
              className="text-white font-semibold px-5 py-2 rounded-lg"
              disabled={
                !date[0] ||
                !date[1] ||
                loading ||
                !estimationData ||
                guestCounts.adults + guestCounts.children === 0
              }
              onClick={handleClick}
            >
              Reserve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
