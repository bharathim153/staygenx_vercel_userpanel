'use client';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useGlobalStore } from '@/lib/store/global-store';
import { clearAllCookies } from '@/utils/helper';
import {
  Globe,
  HelpCircle,
  Heart,
  Compass,
  MessageSquare,
  Settings,
  Home,
  CircleUserRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import PageContext from '../contextprovider';

export const useMenuItems = () => {
  const { i18 } = useContext(PageContext);
  const Menu =
    typeof i18?.HOMEPAGE?.HEADER?.MENU === 'object'
      ? i18?.HOMEPAGE?.HEADER?.MENU
      : undefined;
  const router = useRouter();
  const { openDialog } = useDialogStore();
  const { isLoggedin } = useGlobalStore();

  return [
    ...(isLoggedin
      ? [
          {
            label: Menu?.PROFILE ?? 'Profile',
            icon: <CircleUserRound size={18} />,
            onClick: () => router.push('/users/profile'),
          },
          {
            label: Menu?.TRIPS ?? 'Trips',
            icon: <Compass size={18} />,
            onClick: () => {},
          },
          {
            label: Menu?.WISHLISTS ?? 'Wishlists',
            icon: <Heart size={18} />,
            onClick: () => router.push('/wishlist'),
          },
          {
            label: Menu?.MESSAGES ?? 'Messages',
            icon: <MessageSquare size={18} />,
            onClick: () => router.push('/message'),
          },
          {
            label: Menu?.ACCOUNT_SETTINGS ?? 'Account settings',
            icon: <Settings size={18} />,
            onClick: () => router.push('/account-settings/personal-info'),
          },
          {
            label: Menu?.LANGUAGE_CURRENCY ?? 'Languages & currency',
            icon: <Globe size={18} />,
            onClick: () => {},
          },
        ]
      : []),

    ...(isLoggedin ? [{ divider: true }] : []),

    {
      label: Menu?.HELP_CENTRE ?? 'Help Centre',
      icon: <HelpCircle size={18} />,
      onClick: () => {},
    },

    { divider: true },

    {
      label: Menu?.BECOME_A_HOST ?? 'Become a host',
      icon: <Home size={18} />,
      subLabel:
        Menu?.DESC ?? 'It’s easy to start hosting and earn extra income.',
      image: '/host.png',
      onClick: () => {},
    },
    {
      label: Menu?.REFER_A_HOST ?? 'Refer a host',
      onClick: () => {},
    },
    {
      label: Menu?.FIND_A_CO_HOST ?? 'Find a co-host',
      onClick: () => {},
    },

    { divider: true },

    ...(isLoggedin
      ? [
          {
            label: Menu?.LOG_OUT ?? 'Log out',
            onClick: () => clearAllCookies(),
          },
        ]
      : [
          {
            label: 'Login / Signup',
            onClick: () => openDialog('Login'),
          },
        ]),
  ];
};
