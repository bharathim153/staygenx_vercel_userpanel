'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder = 'Select an option',
  value,
  onChange,
  disabled = false,
  className = '',
  contentClassName = '',
}) => {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={cn(
          'w-full flex items-center justify-between rounded-md border border-gray-300 px-4 py-4 bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black-500',
          className
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          side="bottom"
          align="start"
          className={cn(
            'mt-2 w-full min-w-[200px] rounded-md border bg-white p-1 shadow-md',
            contentClassName
          )}
        >
          <SelectPrimitive.Viewport>
            {options.map(option => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  'flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-md select-none',
                  value === option.value && 'bg-gray-100'
                )}
              >
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <span className="h-5 w-5">{option.icon}</span>
                  )}
                  <span>{option.label}</span>
                </div>

                <SelectPrimitive.ItemIndicator>
                  <Check className="w-4 h-4 text-gray-500" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

export default CustomSelect;
