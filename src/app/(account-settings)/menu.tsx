'use client';
import {
  User,
  Shield,
  Hand,
  Bell,
  Calculator,
  Wallet,
  Globe,
  Briefcase,
  Ruler,
  UsersRound,
} from 'lucide-react';
import UserProfile from '../components/userProfile';
import { useContext } from 'react';
import PageContext from '../components/contextprovider';

export const SettingsItems = () => {
  const { i18 } = useContext(PageContext);
  const Settingsitems =
    typeof i18?.ACCOUNTSETTINGS?.MENU?.LABEL === 'object'
      ? i18?.ACCOUNTSETTINGS?.MENU
      : undefined;
  return [
    {
      label: Settingsitems?.PERSONAL_INFORMATION ?? 'Personal information',
      icon: <User size={18} />,
      routes: '/account-settings/personal-info',
    },
    {
      label: Settingsitems?.LOGIN_SECURITY ?? 'Login & security',
      icon: <Shield size={18} />,
      routes: '/account-settings/login-and-security',
    },
    {
      label: Settingsitems?.PRIVACY ?? 'Privacy',
      icon: <Hand size={18} />,
      routes: '/account-settings/privacy',
    },
    {
      label: Settingsitems?.NOTIFICATIONS ?? 'Notifications',
      icon: <Bell size={18} />,
      routes: '/account-settings/notifications',
    },
    {
      label: Settingsitems?.TAXES ?? 'Taxes',
      icon: <Calculator size={18} />,
      routes: '/account-settings/taxes',
    },
    {
      label: Settingsitems?.PAYMENTS ?? 'Payments',
      icon: <Wallet size={18} />,
      routes: '/account-settings/payments',
    },
    {
      label: Settingsitems?.LANGUAGES_CURRENCY ?? 'Languages & currency',
      icon: <Globe size={18} />,
      routes: '/account-settings/languages-currency',
    },
    {
      label: Settingsitems?.TRAVEL_FOR_WORK ?? 'Travel for work',
      icon: <Briefcase size={18} />,
      routes: '/account-settings/travel-for-work',
    },
  ];
};
export const ProfileItems = () => {
  const { i18 } = useContext(PageContext);
  const Profileitems =
    typeof i18?.HOMEPAGE?.HEADER?.PROFILEPAGE?.LABEL === 'object'
      ? i18?.HOMEPAGE?.HEADER?.PROFILEPAGE
      : undefined;
  return [
    {
      label: Profileitems?.ABOUTME ?? 'About me',
      icon: <UserProfile className="w-7 h-7 text-[10px]" />,
      routes: '/users/profile/about',
    },
    {
      label: Profileitems?.PASTTRIPS ?? 'Past trips',
      icon: <Briefcase size={18} />,
      routes: '/users/profile/past-trips',
    },
    {
      label: Profileitems?.CONNECTS ?? 'Connects',
      icon: <UsersRound size={18} />,
      routes: '/users/profile/connections',
    },
  ];
};

export const footerItem = {
  label: 'Professional hosting tools',
  icon: <Ruler size={18} />,
};
