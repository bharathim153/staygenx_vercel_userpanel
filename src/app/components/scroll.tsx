'use client';
import Button from '@/shadcn/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ScrollSection({
  children,
  scrollVal = true,
}: {
  children: React.ReactNode;
  scrollVal?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollVal) return;
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollVal) return;
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollTo({
      left:
        direction === 'left'
          ? el.scrollLeft - scrollAmount
          : el.scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!scrollVal) return;
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={` ${scrollVal ? 'overflow-x-auto space-x-4  scroll-smooth scrollbar-hide flex' : ''}  `}
      >
        {children}
      </div>

      {scrollVal && (
        <div className="hidden md:flex items-center gap-2 absolute top-[-25px] right-0 transform -translate-y-1/2">
          <Button
            onClick={() => scroll('left')}
            className={`${canScrollLeft ? 'bg-gray-200 ' : 'bg-transparent'}  border p-2 rounded-full z-10  `}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={15} />
          </Button>

          <Button
            onClick={() => scroll('right')}
            className={` ${canScrollRight ? 'bg-gray-200 ' : 'bg-transparent '}  border p-2 rounded-full z-10 `}
            disabled={!canScrollRight}
          >
            <ChevronRight size={15} />
          </Button>
        </div>
      )}
    </div>
  );
}
