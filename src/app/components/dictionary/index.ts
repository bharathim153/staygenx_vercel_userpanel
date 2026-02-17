import { deepWrap } from '@/utils/deepwrap';
import 'server-only';

const dictionaries = {
  en: () => import('./en.json').then(module => module.default),
};

export const getDictionary = async (locale: 'en') => {
  const rawdict = await dictionaries[locale]();
  return deepWrap(rawdict);
};
