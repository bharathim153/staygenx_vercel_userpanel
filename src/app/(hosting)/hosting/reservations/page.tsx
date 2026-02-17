'use client';
import React, { useEffect, useState } from 'react';
import { getHostBookings } from '@/services/host/hostBookings';
import { useToastStore } from '@/lib/store/toast-store';
import axios from 'axios';
// Cancel booking handler

import { getCookie } from '@/utils/helper';

const tabList = [
  { key: 'pending', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'all', label: 'All' },
];

const tabContent: Record<
  string,
  { title: string; link: string; linkText: string }
> = {
  pending: {
    title: 'You have no upcoming reservations',
    link: '#',
    linkText: 'See all reservations',
  },
  completed: {
    title: 'You have no completed reservations',
    link: '#',
    linkText: 'See all reservations',
  },
  cancelled: {
    title: 'You have no cancelled reservations',
    link: '#',
    linkText: 'See all reservations',
  },
  all: {
    title: 'You have no reservations',
    link: '#',
    linkText: 'See all reservations',
  },
};

type Booking = {
  _id: string;
  status: string;
  guestId?: {
    firstName?: string;
    lastName?: string;
  };
  guestCount?: number;
  guests?: number;
  checkInDate?: string;
  checkOutDate?: string;
  listingId?: {
    _id?: string;
  };
  subtotal?: number;
  total?: number;
  nights?: number;
  // Add more fields as needed
};

const ReservationsPage = () => {
  // Modal state for cancel/accept confirmation
  const [cancelConfirm, setCancelConfirm] = useState<{
    open: boolean;
    bookingId?: string;
    booking?: Booking;
  } | null>(null);
  const [acceptConfirm, setAcceptConfirm] = useState<{
    open: boolean;
    bookingId?: string;
    booking?: Booking;
  } | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = getCookie('appToken');
    axios
      .get<{ data: Booking[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL || ''}booking/host-bookings?tab=${activeTab}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      )
      .then(res => {
        const data: Booking[] = Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setBookings(data);
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Modal state for details popup
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    const closeMenu = () => setMenuOpenIdx(null);

    if (menuOpenIdx !== null) {
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
    }
  }, [menuOpenIdx]);
  console.log('Current bookings state:', bookings);

  const [cancelLoading, setCancelLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const triggerToast = useToastStore(state => state.triggerToast);

  const handleCancelBooking = async (bookingId: string) => {
    setCancelLoading(true);
    try {
      const token = getCookie('appToken');
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL || ''}booking/decline/${bookingId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      if (response.status === 200) {
        triggerToast(
          response.data?.message || 'Booking cancelled successfully',
          'success',
          'top-right'
        );
        setLoading(true);
        getHostBookings({ tab: activeTab })
          .then(res => {
            const responseData = res.data as { data?: Booking[] };
            const data: Booking[] = Array.isArray(responseData.data)
              ? responseData.data
              : [];
            setBookings(data);
          })
          .finally(() => setLoading(false));
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      triggerToast(
        error?.response?.data?.message || 'Failed to cancel booking',
        'error',
        'top-right'
      );
      // Optionally log error
    } finally {
      setCancelLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    setAcceptLoading(true);
    try {
      const token = getCookie('appToken');
      console.log('Accepting booking with ID:', token);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL || ''}booking/accept/${bookingId}`,
        {}, // Empty body
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      console.log('Accept booking response:', response);
      if (response.status === 201) {
        triggerToast(
          response.data?.message || 'Booking accepted successfully',
          'success',
          'top-right'
        );
        setLoading(true);
        getHostBookings({ tab: activeTab })
          .then(res => {
            const responseData = res.data as { data?: Booking[] };
            const data: Booking[] = Array.isArray(responseData.data)
              ? responseData.data
              : [];
            setBookings(data);
          })
          .finally(() => setLoading(false));
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      triggerToast(
        error?.response?.data?.message || 'Failed to accept booking',
        'error',
        'top-right'
      );
      // Optionally log error
    } finally {
      setAcceptLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', background: '#fff' }}>
      <div style={{ padding: '32px 20px 0 20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 0 }}>
          Reservations
        </h1>
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '24px',
            borderBottom: '1px solid #ddd',
          }}
        >
          {tabList.map(tab => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                paddingBottom: '8px',
                borderBottom:
                  activeTab === tab.key
                    ? '2px solid #222'
                    : '2px solid transparent',
                fontWeight: activeTab === tab.key ? 600 : 500,
                color: activeTab === tab.key ? '#222' : '#717171',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',

          height: '100%',
        }}
      >
        {loading ? (
          <div>Loading reservations...</div>
        ) : bookings && bookings.length > 0 ? (
          <div
            style={{
              width: '100%',
              maxWidth: 1800,
              overflowX: 'auto',
              marginTop: '20px',
              height: bookings.length < 3 ? '300px' : 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: '#fff',
              }}
            >
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #eee',
                      textAlign: 'left',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #eee',
                      textAlign: 'left',
                    }}
                  >
                    Guest Name
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #eee',
                      textAlign: 'left',
                    }}
                  >
                    Guest Count
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #eee',
                      textAlign: 'left',
                    }}
                  >
                    Check-in
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #eee',
                      textAlign: 'left',
                    }}
                  >
                    Check-out
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #eee',
                      textAlign: 'left',
                    }}
                  >
                    Listing (ID)
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #eee',
                      textAlign: 'left',
                    }}
                  >
                    Total Payout
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #eee',
                      textAlign: 'left',
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, idx) => {
                  const guestCount = booking.guestCount || booking.guests || 1;
                  return (
                    <tr key={idx}>
                      <td style={{ padding: '10px', border: '1px solid #eee' }}>
                        {booking.status}
                      </td>

                      <td style={{ padding: '10px', border: '1px solid #eee' }}>
                        {booking.guestId?.firstName} {booking.guestId?.lastName}
                      </td>

                      <td style={{ padding: '10px', border: '1px solid #eee' }}>
                        {guestCount}
                      </td>

                      <td style={{ padding: '10px', border: '1px solid #eee' }}>
                        {booking.checkInDate
                          ? new Date(booking.checkInDate).toLocaleDateString()
                          : ''}
                      </td>

                      <td style={{ padding: '10px', border: '1px solid #eee' }}>
                        {booking.checkOutDate
                          ? new Date(booking.checkOutDate).toLocaleDateString()
                          : ''}
                      </td>

                      <td style={{ padding: '10px', border: '1px solid #eee' }}>
                        {booking.listingId?._id || ''}
                      </td>

                      <td style={{ padding: '10px', border: '1px solid #eee' }}>
                        ₹{booking.subtotal || booking.total || 0}
                      </td>

                      {/* Actions */}
                      <td
                        style={{
                          padding: '10px',
                          border: '1px solid #eee',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        {/* Details Button */}
                        <button
                          style={{
                            border: '1px solid #e41e28',
                            color: '#fff',
                            borderRadius: 6,
                            padding: '4px 18px',
                            background: '#e41e28',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginRight: 8,
                          }}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          Details
                        </button>

                        {/* 3-dot Button */}
                        <div style={{ position: 'relative' }}>
                          <button
                            style={{
                              border: 'none',
                              background: 'none',
                              fontSize: 24,
                              color: '#000',
                              cursor: 'pointer',
                              width: 32,
                              height: 32,
                              display:
                                activeTab === 'upcoming' ||
                                  (activeTab === 'all' &&
                                    booking.status === 'Pending')
                                  ? 'flex'
                                  : 'none',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              setMenuOpenIdx(idx === menuOpenIdx ? null : idx);
                            }}
                          >
                            &#8942;
                          </button>

                          {/* Dropdown Menu */}
                          {menuOpenIdx === idx &&
                            (activeTab === 'upcoming' ||
                              (activeTab === 'all' &&
                                booking.status === 'Pending')) && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 36,
                                  right: 0,
                                  background: '#fff',
                                  border: '1px solid #eee',
                                  borderRadius: 6,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                  zIndex: 10,
                                  minWidth: 200,
                                  padding: 4,
                                }}
                              >
                                <button
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'none',
                                    color: '#e53e3e',
                                    fontWeight: 600,
                                    padding: '8px 0',
                                    borderRadius: 4,
                                    cursor: cancelLoading
                                      ? 'not-allowed'
                                      : 'pointer',
                                    opacity: cancelLoading ? 0.6 : 1,
                                  }}
                                  disabled={cancelLoading}
                                  onClick={async () => {
                                    setCancelConfirm({
                                      open: true,
                                      bookingId: booking._id,
                                      booking,
                                    });

                                    setMenuOpenIdx(null);
                                  }}
                                >
                                  {cancelLoading
                                    ? 'Cancelling...'
                                    : 'Cancel Booking'}
                                </button>

                                <button
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'none',
                                    color: '#e53e3e',
                                    fontWeight: 600,
                                    padding: '8px 0',
                                    borderRadius: 4,
                                    cursor: cancelLoading
                                      ? 'not-allowed'
                                      : 'pointer',
                                    opacity: cancelLoading ? 0.6 : 1,
                                  }}
                                  disabled={cancelLoading}
                                  onClick={async () => {
                                    setAcceptConfirm({
                                      open: true,
                                      bookingId: booking._id,
                                      booking,
                                    });

                                    setMenuOpenIdx(null);
                                  }}
                                >
                                  {cancelLoading
                                    ? 'Cancelling...'
                                    : 'Accept Booking'}
                                </button>
                              </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Details Modal - Card Design */}
              {selectedBooking && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                  }}
                  onClick={() => setSelectedBooking(null)}
                >
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 12,
                      padding: 32,
                      minWidth: 350,
                      maxWidth: 420,
                      boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                      position: 'relative',
                      fontFamily: 'inherit',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'none',
                        border: 'none',
                        fontSize: 22,
                        cursor: 'pointer',
                        color: '#888',
                      }}
                      onClick={() => setSelectedBooking(null)}
                    >
                      ×
                    </button>
                    <h2
                      style={{
                        marginTop: 0,
                        marginBottom: 24,
                        textAlign: 'center',
                        fontWeight: 700,
                      }}
                    >
                      Booking Details
                    </h2>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600 }}>nights: </span>
                        <span>{selectedBooking.nights}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Status: </span>
                        <span>{selectedBooking.status}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Guest Name: </span>
                        <span>
                          {selectedBooking.guestId?.firstName}{' '}
                          {selectedBooking.guestId?.lastName}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Guest Count: </span>
                        <span>
                          {selectedBooking.guestCount ||
                            selectedBooking.guests ||
                            1}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Check-in: </span>
                        <span>
                          {selectedBooking.checkInDate
                            ? new Date(
                              selectedBooking.checkInDate
                            ).toLocaleDateString()
                            : ''}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Check-out: </span>
                        <span>
                          {selectedBooking.checkOutDate
                            ? new Date(
                              selectedBooking.checkOutDate
                            ).toLocaleDateString()
                            : ''}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Listing ID: </span>
                        <span>{selectedBooking.listingId?._id || ''}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Subtotal: </span>
                        <span>
                          ₹
                          {selectedBooking.subtotal ||
                            selectedBooking.total ||
                            0}
                        </span>
                      </div>
                      {/* Add more fields as needed */}
                    </div>
                  </div>
                </div>
              )}
            </table>
          </div>
        ) : (
          <>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1.25rem',
                marginBottom: '8px',
                textAlign: 'center',
                marginTop: '50px',
              }}
            >
              {tabContent[activeTab].title}
            </div>
            <a
              href={tabContent[activeTab].link}
              style={{
                color: '#222',
                textDecoration: 'underline',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              {tabContent[activeTab].linkText}
            </a>
          </>
        )}
      </div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          color: '#717171',
          fontSize: '1.1rem',
        }}
      >
        How can we make it easier to manage your reservations?{' '}
        <a href="#" style={{ color: '#222', textDecoration: 'underline' }}>
          Share your feedback
        </a>
      </div>

      {cancelConfirm?.open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2100,
          }}
          onClick={() => setCancelConfirm(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 36,
              minWidth: 400,
              maxWidth: 480,
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              position: 'relative',
              fontFamily: 'inherit',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#888',
              }}
              onClick={() => setCancelConfirm(null)}
            >
              ×
            </button>
            <h2
              style={{
                marginTop: 0,
                marginBottom: 18,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '1.4rem',
              }}
            >
              Are you sure you want to cancel this booking?
            </h2>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 18,
                marginTop: 12,
              }}
            >
              <button
                style={{
                  minWidth: 120,
                  background: '#e41e28',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: cancelLoading ? 'not-allowed' : 'pointer',
                  opacity: cancelLoading ? 0.6 : 1,
                  transition: 'background 0.2s',
                }}
                disabled={cancelLoading}
                onClick={async () => {
                  if (cancelConfirm?.bookingId) {
                    await handleCancelBooking(cancelConfirm.bookingId);
                  }
                  setCancelConfirm(null);
                }}
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
              <button
                style={{
                  minWidth: 120,
                  background: '#eee',
                  color: '#222',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => setCancelConfirm(null)}
              >
                No, Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {acceptConfirm?.open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2100,
          }}
          onClick={() => setAcceptConfirm(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 36,
              minWidth: 400,
              maxWidth: 480,
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              position: 'relative',
              fontFamily: 'inherit',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#888',
              }}
              onClick={() => setAcceptConfirm(null)}
            >
              ×
            </button>
            <h2
              style={{
                marginTop: 0,
                marginBottom: 18,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '1.4rem',
              }}
            >
              Are you sure you want to accept this booking?
            </h2>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 18,
                marginTop: 12,
              }}
            >
              <button
                style={{
                  minWidth: 120,
                  background: '#e41e28',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: acceptLoading ? 'not-allowed' : 'pointer',
                  opacity: acceptLoading ? 0.6 : 1,
                  transition: 'background 0.2s',
                }}
                disabled={acceptLoading}
                onClick={async () => {
                  if (acceptConfirm?.bookingId) {
                    await handleAcceptBooking(acceptConfirm.bookingId);
                  }
                  setAcceptConfirm(null);
                }}
              >
                {acceptLoading ? 'Accepting...' : 'Yes, Accept'}
              </button>
              <button
                style={{
                  minWidth: 120,
                  background: '#eee',
                  color: '#222',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => setAcceptConfirm(null)}
              >
                No, Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
