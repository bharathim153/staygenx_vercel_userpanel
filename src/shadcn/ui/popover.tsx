'use client';

import * as Popover from '@radix-ui/react-popover';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils'; // optional utility for className merge

type PopoverComponentProps = {
  trigger: ReactNode;
  content: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export default function PopoverComponent({
  trigger,
  content,
  side = 'bottom',
  align = 'center',
  className,
}: PopoverComponentProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          className={cn('z-50  ', className)}
        >
          {content}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
