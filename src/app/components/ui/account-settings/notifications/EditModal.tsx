'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NotificationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    title: string;
    description: string;
    method: 'email' | 'push' | 'sms';
    enabled: boolean;
  } | null;
  onSave: (settings: { email: boolean; push: boolean; sms: boolean }) => void;
}

export default function NotificationEditModal({
  isOpen,
  onClose,
  notification,
  onSave,
}: NotificationEditModalProps) {
  const [settings, setSettings] = useState({
    email: notification?.method === 'email' && notification?.enabled,
    push: notification?.method === 'push' && notification?.enabled,
    sms: notification?.method === 'sms' && notification?.enabled,
  });

  if (!isOpen || !notification) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit notification preferences
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">
              {notification.title}
            </h3>
            <p className="text-sm text-gray-600">
              Choose how you&apos;d like to receive these notifications
            </p>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">
                  Get notifications via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email}
                  onChange={e =>
                    setSettings(prev => ({ ...prev, email: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Push notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push notifications</p>
                <p className="text-sm text-gray-600">
                  Get notifications on your device
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.push}
                  onChange={e =>
                    setSettings(prev => ({ ...prev, push: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Text messages</p>
                <p className="text-sm text-gray-600">
                  Get notifications via SMS
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sms}
                  onChange={e =>
                    setSettings(prev => ({ ...prev, sms: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
