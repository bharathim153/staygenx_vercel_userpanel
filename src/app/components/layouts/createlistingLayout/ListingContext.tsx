'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
export interface ListingContextType {
  disabled: boolean | null;
  setDisabled: (val: boolean) => void;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export function ListingProvider({ children }: { children: ReactNode }) {
  const [disabled, setDisabled] = useState<boolean>(false);

  return (
    <ListingContext.Provider value={{ disabled, setDisabled }}>
      {children}
    </ListingContext.Provider>
  );
}

export function useListingContext() {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListingContext must be used within a ListingProvider');
  }
  return context;
}
