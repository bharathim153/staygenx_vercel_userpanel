'use client';
import React, { useEffect, useState } from 'react';
import { useToastStore } from '@/lib/store/toast-store';
import axios from 'axios';
import { getCookie } from '@/utils/helper';
import Button from '@/shadcn/ui/Button';

const tabList = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'all', label: 'All' },
];

const tabContent: Record<
  string,
  { title: string; link: string; linkText: string }
> = {
  upcoming: {
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

const getUserBookings = async () => {
  const token = getCookie('appToken');
  return axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL || ''}booking/my-bookings`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  );
};

type Booking = {
  _id: string;
  status: string;
  listingId?: {
    _id?: string;
    title?: string;
  };
  guestCount?: number;
  guests?: number;
  checkInDate?: string;
  checkOutDate?: string;
  subtotal?: number;
  total?: number;
  nights?: number;
  isReviewed?: boolean;
  // Add more fields as needed
};

// Simulate Reviewdata from API for demo; replace with real data as needed
// const Reviewdata: ReviewData | null = null;

// interface ReviewData {
//     review?: string;
//     rating?: {
//         Cleanliness?: number;
//         Accuracy?: number;
//         Communication?: number;
//         Location?: number;
//         Amenities?: number;
//         Security?: number;
//     };
// }

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState<Record<string, Booking[]>>({
    upcoming: [],
    completed: [],
    cancelled: [],
    all: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState<{
    open: boolean;
    bookingId?: string;
    booking?: Booking;
  } | null>(null);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    bookingId?: string;
    listingId?: string;
  } | null>(null);
  // State for view review modal
  const [viewReviewModal, setViewReviewModal] = useState<{
    open: boolean;
    listingId?: string;
    reviewData?: any;
  } | null>(null);
  // Track which bookings have a review submitted (by bookingId)
  const [reviewedBookings, setReviewedBookings] = useState<{ [bookingId: string]: boolean }>({});

  type ReviewData = {
    review?: string;
    rating?: {
      Cleanliness?: number;
      Accuracy?: number;
      Communication?: number;
      Location?: number;
      Amenities?: number;
      Security?: number;
    };
  };

  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

  const [reviewText, setReviewText] = useState<string>("");
  const [loadingReview, setLoadingReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const Reviewdata: ReviewData | null = null;

  useEffect(() => {
    // If you have Reviewdata from API, use it here
    setLoadingReview(true);
    if (Reviewdata?.rating?.Cleanliness) {
      setReviewText(Reviewdata?.review || "");
      setReviewData({
        Cleanliness: Reviewdata.rating.Cleanliness || 0,
        Accuracy: Reviewdata.rating.Accuracy || 0,
        Communication: Reviewdata.rating.Communication || 0,
        Location: Reviewdata.rating.Location || 0,
        Amenities: Reviewdata.rating.Amenities || 0,
        Security: Reviewdata.rating.Security || 0
      });
    } else {
      setReviewData({
        Cleanliness: 0,
        Accuracy: 0,
        Communication: 0,
        Location: 0,
        Amenities: 0,
        Security: 0
      });
      setReviewText("");
    }
    setLoadingReview(false);
    // If reviewModal just closed after submit, mark booking as reviewed
    if (reviewModal && !reviewModal.open && reviewModal.bookingId) {
      setReviewedBookings(prev => ({ ...prev, [reviewModal.bookingId!]: true }));
    }
    // eslint-disable-next-line
  }, [reviewModal]);

  console.log("reviewData", reviewData, "reviewText", reviewText);

  const handleStarChange = (field: string, value: number) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };
  const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };
  const triggerToast = useToastStore(state => state.triggerToast);

  useEffect(() => {
    setLoading(true);
    getUserBookings()
      .then(res => {
        const data: Booking[] = Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        console.log('Fetched bookings:', data);
        const tabBookings: Record<string, Booking[]> = {
          upcoming: [],
          completed: [],
          cancelled: [],
          all: data,
        };
        data.forEach((booking: Booking) => {
          if (booking.status === 'Pending') {
            tabBookings.upcoming.push(booking);
          } else if (
            booking.status === 'Completed' ||
            booking.status === 'Confirmed'
          ) {
            tabBookings.completed.push(booking);
          } else if (
            booking.status === 'Cancelled' ||
            booking.status === 'cancelled'
          ) {
            tabBookings.cancelled.push(booking);
          }
        });
        setBookings(tabBookings);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const closeMenu = () => setMenuOpenIdx(null);
    if (menuOpenIdx !== null) {
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
    }
  }, [menuOpenIdx]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancelLoading(true);
    try {
      const token = getCookie('appToken');
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL || ''}booking/reserve/${bookingId}`,
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
        getUserBookings()
          .then(res => {
            const data: Booking[] = Array.isArray(res?.data?.data)
              ? res.data.data
              : [];
            const tabBookings: Record<string, Booking[]> = {
              upcoming: [],
              completed: [],
              cancelled: [],
              all: data,
            };
            data.forEach((booking: Booking) => {
              if (booking.status === 'Pending') {
                tabBookings.upcoming.push(booking);
              } else if (
                booking.status === 'Completed' ||
                booking.status === 'Confirmed'
              ) {
                tabBookings.completed.push(booking);
              } else if (
                booking.status === 'Cancelled' ||
                booking.status === 'cancelled'
              ) {
                tabBookings.cancelled.push(booking);
              }
            });
            setBookings(tabBookings);
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
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', background: '#fff' }}>
      <div style={{ padding: '32px 20px 0 20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 0 }}>
          My Bookings
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
          minHeight: '50vh',
        }}
      >
        {loading ? (
          <div>Loading bookings...</div>
        ) : bookings[activeTab] && bookings[activeTab].length > 0 ? (
          <div
            style={{
              width: '100%',
              maxWidth: 1800,
              overflow: 'auto',
              marginTop: '20px',
              height: bookings[activeTab].length <= 2 ? '500px' : '800px',
            }}
          >
            {/* {bookings[activeTab].length <= 2} */}
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: '#fff',
              }}
            >
              <thead>

                <tr style={{ background: '#f5f5f5' }} >
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
                    Listing Title
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
                    Subtotal
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
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #eee',
                      textAlign: 'left',
                    }}
                  >
                    Ratings
                  </th>
                </tr>

              </thead>
              <tbody>
                {bookings[activeTab].map((booking, idx) => {
                  const guestCount = booking.guestCount || booking.guests || 1;
                  return (
                    <tr key={idx}>
                      <td style={{ padding: '10px', border: '1px solid #eee' }}>
                        {booking.status}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #eee' }}>
                        {booking.listingId?.title}{' '}
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

                      <td
                        style={{
                          padding: '10px',
                          border: '1px solid #eee',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
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
                        <div style={{ position: 'relative' }}>
                          <button
                            style={{
                              border: 'none',
                              background: 'none',
                              fontSize: 24,
                              color:
                                activeTab === 'upcoming' ||
                                  (activeTab === 'all' &&
                                    booking.status === 'Pending')
                                  ? '#888'
                                  : '#8080803d',
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
                                    opacity: cancelLoading ? 0.1 : 1,
                                  }}
                                  disabled={cancelLoading}
                                  onClick={() => {
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
                              </div>
                            )}
                        </div>
                      </td>

                      {(booking?.status === "Confirmed" || booking?.status === "Completed") && (
                        <td
                          style={{
                            whiteSpace: 'nowrap',
                            padding: '10px',
                            border: '1px solid #eee',
                          }}
                        >
                          {reviewedBookings[booking._id] ? (
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
                              onClick={async () => {
                                // Fetch review data and show modal
                                try {
                                  const res = await axios.get(`https://staygenxapi.opengenx.com/reviews/listing/${booking?.listingId?._id}`);
                                  setViewReviewModal({ open: true, listingId: booking?.listingId?._id, reviewData: res.data });
                                } catch (err) {
                                  setViewReviewModal({ open: true, listingId: booking?.listingId?._id, reviewData: { error: 'Failed to fetch review' } });
                                }
                              }}
                            >
                              View Review
                            </button>
                          ) : (
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
                              onClick={() => {
                                setReviewModal({
                                  open: true,
                                  bookingId: booking._id,
                                  listingId: booking?.listingId?._id,
                                });
                              }}
                            >
                              Reviews & Ratings
                            </button>
                          )}
                        </td>)}
                    </tr>
                  );
                })}
              </tbody>
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
                        <span style={{ fontWeight: 600 }}>Listing Name: </span>
                        <span>{selectedBooking.listingId?.title}</span>
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
      {/* Review & Rating Modal */}
      {reviewModal?.open && (
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
            zIndex: 2000,
          }}
          onClick={() => setReviewModal(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 32,
              minWidth: 550,
              maxWidth: 550,
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
              onClick={() => setReviewModal(null)}
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
              Review & Rating
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!reviewModal?.bookingId || !bookings[activeTab]) {
                  triggerToast('Booking info missing', 'error', 'top-right');
                  return;
                }
                setSubmittingReview(true);
                try {
                  // Find the booking to get listingId
                  const booking = bookings[activeTab].find(b => b._id === reviewModal.bookingId);
                  console.log("booking1111", booking)
                  console.log("reviewData1111", reviewModal)
                  const payload = {
                    bookingId: reviewModal.bookingId,
                    listingId: reviewModal?.listingId || '',
                    cleanliness: reviewData.Cleanliness,
                    accuracy: reviewData.Accuracy,
                    checkIn: reviewData.Location, // Map Location to checkIn
                    communication: reviewData.Communication,
                    location: reviewData.Location,
                    value: reviewData.Amenities, // Map Amenities to value
                    comment: reviewText,
                  };
                  const token = getCookie('appToken');
                  const res = await axios.post('https://staygenxapi.opengenx.com/reviews', payload, {
                    headers: {
                      Authorization: token ? `Bearer ${token}` : '',
                      'Content-Type': 'application/json',
                    },
                  });
                  if (res.status === 200 || res.status === 201) {
                    triggerToast('Review submitted successfully!', 'success', 'top-right');
                    setReviewModal(null);
                    // Mark this booking as reviewed
                    setReviewedBookings(prev => ({ ...prev, [reviewModal.bookingId!]: true }));
                  } else {
                    triggerToast('Failed to submit review', 'error', 'top-right');
                  }
                  {/* View Review Modal */ }
                  {
                    viewReviewModal?.open && (
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
                        onClick={() => setViewReviewModal(null)}
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
                            onClick={() => setViewReviewModal(null)}
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
                            Review Details
                          </h2>
                          {viewReviewModal.reviewData?.error ? (
                            <div style={{ color: 'red', textAlign: 'center' }}>{viewReviewModal.reviewData.error}</div>
                          ) : (
                            <div style={{ fontSize: 16 }}>
                              {/* Render review data here */}
                              {Array.isArray(viewReviewModal.reviewData?.data) && viewReviewModal.reviewData.data.length > 0 ? (
                                viewReviewModal.reviewData.data.map((review: any, idx: number) => (
                                  <div key={idx} style={{ marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 12 }}>
                                    <div><b>Review:</b> {review.review || 'No review text'}</div>
                                    <div style={{ marginTop: 6 }}>
                                      <b>Ratings:</b>
                                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                                        {review.rating && Object.entries(review.rating).map(([k, v]) => (
                                          <li key={k}>{k}: {v}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div>No reviews found for this listing.</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }
                } catch (err: unknown) {
                  if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    // @ts-expect-error: checked above
                    triggerToast(err.response.data.message || 'Failed to submit review', 'error', 'top-right');
                  } else {
                    triggerToast('Failed to submit review', 'error', 'top-right');
                  }
                } finally {
                  setSubmittingReview(false);
                }
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {['Cleanliness', 'Accuracy', 'Communication', 'Location', 'Amenities', 'Security'].map((field) => (
                  <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label htmlFor={field}>{field}:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          style={{ fontSize: 22, cursor: 'pointer', color: reviewData[field as keyof typeof reviewData] >= star ? '#FFD700' : '#ccc' }}
                          onClick={() => handleStarChange(field, star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <textarea
                  aria-label="Message"
                  placeholder="Say something about your experience in this place..."
                  style={{ width: '100%', minHeight: 80, borderRadius: 6, border: '1px solid #ddd', padding: 10, fontSize: 16 }}
                  value={reviewText}
                  onChange={handleReviewTextChange}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" style={{ minWidth: 120, background: "#e41e28", color: "#fff" }} disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          color: '#717171',
          fontSize: '1.1rem',
        }}
      >
        How can we make it easier to manage your bookings?{' '}
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
    </div>
  );
};

export default BookingPage;
