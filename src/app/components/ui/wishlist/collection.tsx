'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCookie } from '@/utils/helper';
import axios from 'axios';

import { useEffect, useState } from 'react';

interface Wishlist {
  _id: string;
  name: string;
  listings?: Array<{
    images?: string[];
  }>;
  title?: string;
  subtitle?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

export default function Wishlists() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    const fetchWishlists = async () => {
      setLoading(true);
      try {
        const token = getCookie("appToken");
        const res = await axios.get(`${baseUrl}wishlist/my-wishlists`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        console.log('Fetched wishlists:', res.data.data);
        setWishlists(res.data.data || []);
      } catch (err) {
        console.error('Error fetching wishlists:', err);
        setWishlists([]);
      }
      setLoading(false);
    };
    fetchWishlists();
  }, []);

  return (
    <div className="px-6 py-10">
      <div className="flex items-center justify-between  mb-6">
        <h1 className="text-3xl font-semibold ">Wishlists</h1>
        <p className="text-md font-semibold underline">Edit</p>
      </div>

      <div className="flex flex-wrap gap-6 z-0">
        {wishlists.map((list, idx) => (
          <div
            key={idx}
            className="w-full sm:w-[48%] md:w-[280px] flex flex-col gap-3 cursor-pointer"
            onClick={() => Router.push('/wishlist/1234')}
          >
            <div className="rounded-2xl shadow-md overflow-hidden bg-white">

              <div className="w-full">
                <div className="flex items-start mb-6 flex-wrap">
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : wishlists.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No wishlists found.</div>
                  ) : (
                    wishlists.map((wl: Wishlist) => (
                      <div
                        key={wl._id}
                        className="flex flex-col items-center mb-6 cursor-pointer"
                      // onClick={() => onSelectWishlist(wl._id)}
                      >
                        <div className="rounded-2xl overflow-hidden mb-2 mr-4" style={{ width: 220, height: 180 }}>
                          <Image
                            src={wl.listings?.[0]?.images?.[0] ? wl.listings[0].images[0] : '/images/errorImage.webp'}
                            alt={wl.name}
                            width={220}
                            height={180}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-base">{wl.name}</div>
                          <div className="text-xs text-gray-500">{wl.listings?.length || 0} saved</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="px-1">
              <h2 className="font-semibold text-sm">{list.title}</h2>
              <p className="text-xs text-gray-500">{list.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
