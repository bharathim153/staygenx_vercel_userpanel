'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type ReusableDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  noTitle?: boolean;
};

export default function ReusableDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
  className,
  noTitle = false,
}: ReusableDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />

        {/* Drawer Content */}
        <Dialog.Content
          className={cn(
            'fixed z-50 bg-white shadow-xl transition-transform duration-300 ease-in-out focus:outline-none overflow-y-auto',
            side === 'right' && 'bottom-0 right-0 h-full w-full translate-x-0',
            side === 'left' &&
              'top-0 left-0 h-full w-full sm:max-w-sm translate-x-0',
            side === 'top' && 'top-0 left-0 w-full h-full translate-y-0',
            side === 'bottom' && 'bottom-0 left-0 w-full h-full translate-y-0',
            className
          )}
        >
          {/* Header */}
          {!noTitle ? (
            <div className="flex items-center justify-between p-5">
              <Dialog.Title className="text-base font-bold">
                {title || ''}
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button
                  className="p-2 border shadow-lg rounded-full hover:text-black"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </Dialog.Close>
            </div>
          ) : (
            // Still provide an accessible title for screen readers
            <VisuallyHidden>
              <Dialog.Title>{title || 'Drawer'}</Dialog.Title>
            </VisuallyHidden>
          )}

          {/* Description */}
          {description && (
            <Dialog.Description className="px-5 pt-2 text-sm text-gray-500">
              {description}
            </Dialog.Description>
          )}

          {/* Content */}
          <div className="overflow-y-auto p-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
