'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageContext from './contextprovider';

import type { I18nContextType } from './contextprovider';

export default function GlobalProvider({
  children,
  i18,
}: {
  children: React.ReactNode;
  i18: I18nContextType['i18'];
}) {
  const queryClient = new QueryClient();

  return (
    <>
      <PageContext.Provider
        value={{
          i18: i18,
        }}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </PageContext.Provider>
    </>
  );
}
