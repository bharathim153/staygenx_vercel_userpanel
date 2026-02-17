'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type ReusableDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: boolean;
};

export default function ReusableDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  footer = false,
}: ReusableDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <Dialog.Content
          className={cn(
            `fixed z-50 w-full max-h-[90%] overflow-y-auto md:max-w-xl bg-white shadow-xl focus:outline-none 
             rounded-t-4xl md:rounded-4xl 
             bottom-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
             md:bottom-auto
             transition-all duration-300 ease-out`,
            className
          )}
        >
          <div
            className={`flex items-start justify-center relative p-5 ${
              title ? 'border-b' : ''
            }`}
          >
            {title ? (
              <Dialog.Title className="text-md font-bold">{title}</Dialog.Title>
            ) : (
              <VisuallyHidden>
                <Dialog.Title>Dialog</Dialog.Title>
              </VisuallyHidden>
            )}

            <Dialog.Close asChild>
              <Button className="absolute top-6 right-5" aria-label="Close">
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description className="mt-1 text-sm text-gray-500">
              {description}
            </Dialog.Description>
          )}

          <div className={`${footer ? '' : 'p-5'}`}>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
