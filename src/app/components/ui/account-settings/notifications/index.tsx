'use client';

import React, { useState } from 'react';
import NotificationEditModal from './EditModal';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  category: 'hosting-insights' | 'hosting-updates' | 'travel-tips' | 'account';
  enabled: boolean;
  method: 'email' | 'push' | 'sms';
}

export default function NotificationsSettings() {
  const [activeTab, setActiveTab] = useState<'offers' | 'account'>('offers');
  const [editingNotification, setEditingNotification] =
    useState<NotificationSetting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    // Hosting insights and rewards
    {
      id: 'recognition-achievements',
      title: 'Recognition and achievements',
      description: 'On: Email',
      category: 'hosting-insights',
      enabled: true,
      method: 'email',
    },
    {
      id: 'insights-tips',
      title: 'Insights and tips',
      description: 'On: Email',
      category: 'hosting-insights',
      enabled: true,
      method: 'email',
    },
    {
      id: 'pricing-trends',
      title: 'Pricing trends and suggestions',
      description: 'On: Email',
      category: 'hosting-insights',
      enabled: true,
      method: 'email',
    },
    {
      id: 'hosting-perks',
      title: 'Hosting perks',
      description: 'On: Email',
      category: 'hosting-insights',
      enabled: true,
      method: 'email',
    },
    // Hosting updates
    {
      id: 'news-updates',
      title: 'News and updates',
      description: 'On: Email',
      category: 'hosting-updates',
      enabled: true,
      method: 'email',
    },
    {
      id: 'local-laws',
      title: 'Local laws and regulations',
      description: 'On: Email',
      category: 'hosting-updates',
      enabled: true,
      method: 'email',
    },
    // Travel tips and offers
    {
      id: 'inspiration-offers',
      title: 'Inspiration and offers',
      description: 'On: Email',
      category: 'travel-tips',
      enabled: true,
      method: 'email',
    },
    // Account notifications
    {
      id: 'security-alerts',
      title: 'Security alerts',
      description: 'On: Email, Push notifications',
      category: 'account',
      enabled: true,
      method: 'email',
    },
    {
      id: 'booking-confirmations',
      title: 'Booking confirmations',
      description: 'On: Email, SMS',
      category: 'account',
      enabled: true,
      method: 'email',
    },
    {
      id: 'payment-updates',
      title: 'Payment updates',
      description: 'On: Email',
      category: 'account',
      enabled: true,
      method: 'email',
    },
  ]);

  const handleEditNotification = (notification: NotificationSetting) => {
    setEditingNotification(notification);
    setIsModalOpen(true);
  };

  const handleSaveNotification = (
    id: string,
    settings: { email: boolean; push: boolean; sms: boolean }
  ) => {
    setNotifications(prev =>
      prev.map(notification => {
        if (notification.id === id) {
          let description = 'Off';
          const methods = [];
          if (settings.email) methods.push('Email');
          if (settings.push) methods.push('Push notifications');
          if (settings.sms) methods.push('SMS');

          if (methods.length > 0) {
            description = `On: ${methods.join(', ')}`;
          }

          return {
            ...notification,
            description,
            enabled: methods.length > 0,
          };
        }
        return notification;
      })
    );
  };

  const hostingInsightsNotifications = notifications.filter(
    n => n.category === 'hosting-insights'
  );
  const hostingUpdatesNotifications = notifications.filter(
    n => n.category === 'hosting-updates'
  );
  const travelTipsNotifications = notifications.filter(
    n => n.category === 'travel-tips'
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Notifications
        </h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('offers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'offers'
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Offers and updates
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'account'
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Account
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'offers' && (
        <div className="space-y-12">
          {/* Hosting insights and rewards */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Hosting insights and rewards
              </h2>
              <p className="text-gray-600 text-sm">
                Learn about best hosting practices and get access to exclusive
                hosting perks.
              </p>
            </div>

            <div className="space-y-6">
              {hostingInsightsNotifications.map(notification => (
                <div
                  key={notification.id}
                  className="flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {notification.description}
                    </p>
                  </div>
                  <button
                    className="text-sm font-medium text-gray-900 underline hover:text-gray-700 ml-4"
                    onClick={() => handleEditNotification(notification)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Hosting updates */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Hosting updates
              </h2>
              <p className="text-gray-600 text-sm">
                Get updates about programmes, features, and regulations.
              </p>
            </div>

            <div className="space-y-6">
              {hostingUpdatesNotifications.map(notification => (
                <div
                  key={notification.id}
                  className="flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {notification.description}
                    </p>
                  </div>
                  <button
                    className="text-sm font-medium text-gray-900 underline hover:text-gray-700 ml-4"
                    onClick={() => handleEditNotification(notification)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Travel tips and offers */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Travel tips and offers
              </h2>
              <p className="text-gray-600 text-sm">
                Inspire your next trip with personalised recommendations and
                special offers.
              </p>
            </div>

            <div className="space-y-6">
              {travelTipsNotifications.map(notification => (
                <div
                  key={notification.id}
                  className="flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {notification.description}
                    </p>
                  </div>
                  <button
                    className="text-sm font-medium text-gray-900 underline hover:text-gray-700 ml-4"
                    onClick={() => handleEditNotification(notification)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Account Tab Content */}
      {activeTab === 'account' && (
        <div className="space-y-12">
          {/* Account activity and policies */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Account activity and policies
              </h2>
              <p className="text-gray-600 text-sm">
                Confirm your booking and account activity, and learn about
                important Airbnb policies.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    Account activity
                  </h3>
                  <p className="text-sm text-gray-600">On: Email</p>
                </div>
                <button
                  className="text-sm font-medium text-gray-900 underline hover:text-gray-700 ml-4"
                  onClick={() =>
                    handleEditNotification({
                      id: 'account-activity',
                      title: 'Account activity',
                      description: 'On: Email',
                      category: 'account',
                      enabled: true,
                      method: 'email',
                    })
                  }
                >
                  Edit
                </button>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    Listing activity
                  </h3>
                  <p className="text-sm text-gray-600">On: Email and SMS</p>
                </div>
                <button
                  className="text-sm font-medium text-gray-900 underline hover:text-gray-700 ml-4"
                  onClick={() =>
                    handleEditNotification({
                      id: 'listing-activity',
                      title: 'Listing activity',
                      description: 'On: Email and SMS',
                      category: 'account',
                      enabled: true,
                      method: 'email',
                    })
                  }
                >
                  Edit
                </button>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    Guest policies
                  </h3>
                  <p className="text-sm text-gray-600">On: Email</p>
                </div>
                <button
                  className="text-sm font-medium text-gray-900 underline hover:text-gray-700 ml-4"
                  onClick={() =>
                    handleEditNotification({
                      id: 'guest-policies',
                      title: 'Guest policies',
                      description: 'On: Email',
                      category: 'account',
                      enabled: true,
                      method: 'email',
                    })
                  }
                >
                  Edit
                </button>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    Host policies
                  </h3>
                  <p className="text-sm text-gray-600">On: Email</p>
                </div>
                <button
                  className="text-sm font-medium text-gray-900 underline hover:text-gray-700 ml-4"
                  onClick={() =>
                    handleEditNotification({
                      id: 'host-policies',
                      title: 'Host policies',
                      description: 'On: Email',
                      category: 'account',
                      enabled: true,
                      method: 'email',
                    })
                  }
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Reminders */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Reminders
              </h2>
              <p className="text-gray-600 text-sm">
                Get important reminders about your reservations, listings, and
                account activity.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Reminders</h3>
                  <p className="text-sm text-gray-600">On: Email</p>
                </div>
                <button
                  className="text-sm font-medium text-gray-900 underline hover:text-gray-700 ml-4"
                  onClick={() =>
                    handleEditNotification({
                      id: 'reminders',
                      title: 'Reminders',
                      description: 'On: Email',
                      category: 'account',
                      enabled: true,
                      method: 'email',
                    })
                  }
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Guest and host messages */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Guest and host messages
              </h2>
              <p className="text-gray-600 text-sm">
                Keep in touch with hosts and guests before, during and after
                your reservation.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Messages</h3>
                  <p className="text-sm text-gray-600">On: Email</p>
                </div>
                <button
                  className="text-sm font-medium text-gray-900 underline hover:text-gray-700 ml-4"
                  onClick={() =>
                    handleEditNotification({
                      id: 'messages',
                      title: 'Messages',
                      description: 'On: Email',
                      category: 'account',
                      enabled: true,
                      method: 'email',
                    })
                  }
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <NotificationEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNotification(null);
        }}
        notification={editingNotification}
        onSave={settings => {
          if (editingNotification) {
            handleSaveNotification(editingNotification.id, settings);
          }
        }}
      />
    </div>
  );
}
