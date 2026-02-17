'use client';

export type I18nContextType = {
  i18: {
    [namespace: string]: {
      [key: string]: {
        [key: string]: {
          [key: string]: string;
        };
      };
    };
  };
};

import { createContext, useContext } from 'react';
const defaultValue: I18nContextType = { i18: {} };
const PageContext = createContext(defaultValue);

export const usePageContext = () => {
  return useContext(PageContext);
};

export default PageContext;
