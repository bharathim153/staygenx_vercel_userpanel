'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils'; // Utility for merging Tailwind classes, optional

type TabItem = {
  label: React.ReactNode; // Allow icon + text
  value: string;
  content: React.ReactNode;
};

type TabsComponentProps = {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  tabClassname?: string;
  justify?: 'justify-start' | 'justify-center' | 'justify-end';
};

export default function TabsComponent({
  tabs,
  defaultValue,
  className,
  tabClassname,
  justify = 'justify-center',
}: TabsComponentProps) {
  return (
    <Tabs.Root
      className={cn('w-full', className)}
      defaultValue={defaultValue || tabs[0]?.value}
    >
      <Tabs.List className={`flex items-center gap-4 ${justify}`}>
        {tabs.map(tab => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className={
              tabClassname !== ''
                ? tabClassname
                : cn(
                    'px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent',
                    'data-[state=active]:text-black data-[state=active]:border-black',
                    'hover:text-black'
                  )
            }
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map(tab => (
        <Tabs.Content key={tab.value} value={tab.value} className="py-4">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
