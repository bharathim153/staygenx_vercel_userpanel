'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '@/utils/helper';
import ReviewItem from './ReviewItem';

// Example data (replace with API data in production)
const listings = [
  {
    _id: '69849a0e4aaa34cbb6efe26a',
    title: 'Dindigul House',
    address: 'Dindigul, Tamil Nadu 624001, India',
    images: [
      'https://pub-e3eee9b0bf4b41c883093e7e9fcf11bb.r2.dev/listing-images/c6f98f55-846b-4b70-836e-8e6de63f9e56.jpg',
    ],
  },
  {
    _id: '698aeed84aaa34cbb6f00483',
    title: 'Modern House',
    address: 'Bengaluru, Karnataka, India',
    images: [
      'https://pub-e3eee9b0bf4b41c883093e7e9fcf11bb.r2.dev/listing-images/3181360a-f949-4c9a-bca9-60e57d57176b.jpg',
    ],
  },
];

const ReviewsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(listings[0]?._id || null);
  interface Review {
    _id: string;
    review?: string;
    rating?: {
      Cleanliness?: number;
      Accuracy?: number;
      Communication?: number;
      Location?: number;
      Amenities?: number;
      Security?: number;
    };
    // Add more fields as needed
  }
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      const token = getCookie('appToken');
      axios
        .get(`${baseUrl}reviews/listing/${selectedId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        })
        .then(res => {
          setReviews(Array.isArray(res?.data?.data) ? res.data.data : []);
        })
        .catch(() => setReviews([]))
        .finally(() => setLoading(false));
    }
  }, [selectedId, baseUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
  };

  return (
    <div style={{ minHeight: '80vh', background: '#fff' }}>
      <div style={{ padding: '32px 20px 0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: 8 }}>Reviews</h1>
        <div style={{ display: 'inline-block', marginTop: 8 }}>
          <select
            id="listing-select"
            value={selectedId || ''}
            onChange={handleChange}
            style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          >
            {listings.map(listing => (
              <option key={listing._id} value={listing._id}>
                {listing.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
        {loading ? (
          <div style={{ fontSize: 18, color: '#888', marginTop: 40 }}>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div style={{ width: 420, background: '#fff', borderRadius: 16, border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 16 }}>
              <path d="M24 4l6.9 14.1L46 18l-11 10.7L37.8 44 24 36.7 10.2 44l2.8-15.3L2 18l15.1-1.9L24 4z" stroke="#FF385C" strokeWidth="2" fill="#FFF0F4" />
            </svg>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Your first review will show up here</div>
            <div style={{ color: '#888', fontSize: 15 }}>We&apos;ll let you know when guests leave feedback</div>
          </div>
        ) : (
          <div style={{ width: 700, background: '#fff', borderRadius: 16, border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>

            {reviews.map((review, idx) => (
              <ReviewItem
                key={review._id || idx}
                review={review}
                baseUrl={baseUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
