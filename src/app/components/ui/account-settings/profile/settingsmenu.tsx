'use client';

import React, { JSX } from 'react';
import {
  Settings,
  User,
  Hand,
  HelpCircle,
  Share2,
  Users,
  FileText,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { clearAllCookies } from '@/utils/helper';
import { useRouter } from 'next/navigation';

const settingsList = [
  {
    label: 'Account settings',
    icon: <Settings size={20} />,
    path: '/account-settings/personal-info',
  },
  { label: 'View profile', icon: <User size={20} />, path: '/users/profile' },
  { label: 'Privacy', icon: <Hand size={20} /> },
  { label: 'Get help', icon: <HelpCircle size={20} /> },
];

const extraList = [
  { label: 'Refer a host', icon: <Share2 size={20} /> },
  { label: 'Find a co-host', icon: <Users size={20} /> },
  { label: 'Legal', icon: <FileText size={20} /> },
  {
    label: 'Logout',
    icon: <LogOut size={20} />,
    path: () => clearAllCookies(),
  },
];

const SettingsMenu = () => {
  return (
    <div className="w-full max-w-md mx-auto space-y-3 text-sm">
      {/* Main Settings */}
      <ul>
        {settingsList.map(item => (
          <MenuItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            path={item.path}
          />
        ))}
      </ul>

      {/* Divider */}
      <hr />

      {/* Extra Options */}
      <ul>
        {extraList.map(item => (
          <MenuItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            path={item.path}
          />
        ))}
      </ul>
    </div>
  );
};

// Reusable item component
const MenuItem = ({
  label,
  icon,
  path,
}: {
  label: string;
  icon: JSX.Element;
  path?: string | (() => void);
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (typeof path === 'string') {
      router.push(path);
    } else if (typeof path === 'function') {
      path();
    }
  };

  return (
    <li
      onClick={handleClick}
      className="flex items-center justify-between px-4 py-5 hover:bg-gray-100 rounded-xl cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </li>
  );
};

export default SettingsMenu;
