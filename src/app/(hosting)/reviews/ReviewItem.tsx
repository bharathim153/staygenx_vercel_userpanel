import React, { useState } from 'react';
import axios from 'axios';
import { getCookie } from '@/utils/helper';


interface Review {
    _id: string;
    comment?: string;
    rating?: number | {
        Cleanliness?: number;
        Accuracy?: number;
        Communication?: number;
        Location?: number;
        Amenities?: number;
        Security?: number;
    };
    createdAt?: string;
}

interface ReviewItemProps {
    review: Review;
    baseUrl: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, baseUrl }) => {
    const [showReply, setShowReply] = useState(false);
    const [replyMsg, setReplyMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReply = async () => {
        if (!replyMsg.trim()) {
            alert('Please enter a reply message.');
            return;
        }
        setLoading(true);
        const token = getCookie('appToken');
        try {
            await axios.post(
                `${baseUrl}reviews/${review._id}/host-reply`,
                { message: replyMsg },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                }
            );
            alert('Reply sent!');
            setShowReply(false);
            setReplyMsg('');
        } catch {
            alert('Failed to reply.');
        } finally {
            setLoading(false);
        }
    };

    const handleHide = async () => {
        setLoading(true);
        const token = getCookie('appToken');
        try {
            await axios.post(
                `${baseUrl}reviews/${review._id}/hide`,
                {},
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                }
            );
            alert('Hide API called!');
        } catch {
            alert('Failed to hide review.');
        } finally {
            setLoading(false);
        }
    };

    const getRatingDisplay = () => {
        if (!review.rating) {
            return '-';
        }
        if (typeof review.rating === 'object') {
            const ratings = review.rating as Record<string, number>;
            return Object.entries(ratings)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
        }
        return review.rating;
    };

    return (
        <div style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>{review.comment || 'No comment'}</div>
            <div style={{ color: '#888', fontSize: 14 }}>Rating: {getRatingDisplay()}</div>
            <div style={{ color: '#888', fontSize: 14 }}>Date: {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '-'}</div>
            <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                <button
                    style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #FF385C', background: '#fff', color: '#FF385C', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => setShowReply(v => !v)}
                    disabled={loading}
                >
                    Reply
                </button>
                <button
                    style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #888', background: '#f8f8f8', color: '#444', fontWeight: 600, cursor: 'pointer' }}
                    onClick={handleHide}
                    disabled={loading}
                >
                    Hide
                </button>
            </div>
            {showReply && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <textarea
                        value={replyMsg}
                        onChange={e => setReplyMsg(e.target.value)}
                        rows={3}
                        placeholder="Type your reply..."
                        style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8, fontSize: 15 }}
                        disabled={loading}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={handleReply}
                            style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #FF385C', background: '#FF385C', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button
                            onClick={() => { setShowReply(false); setReplyMsg(''); }}
                            style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #888', background: '#fff', color: '#444', fontWeight: 600, cursor: 'pointer' }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewItem;
