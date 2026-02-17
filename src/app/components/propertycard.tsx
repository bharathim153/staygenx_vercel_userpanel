
'use client';
import Image from 'next/image';

function SavedToWishlistToast({ open, image, wishlistName, onChange }: { open: boolean, image: string, wishlistName: string, onChange: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed left-6 bottom-10 z-50 bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 min-w-[270px] max-w-xs border">
      {/* <div className="w-12 h-12 rounded-xl overflow-hidden mr-3 flex-shrink-0">
        <Image src={image} alt="wishlist-img" width={48} height={48} className="object-cover w-full h-full" />
      </div> */}
      <div className="flex-1">
        <div className="text-sm font-medium">Saved to {wishlistName}</div>
      </div>
      <button className="ml-4 text-sm font-semibold underline text-gray-700" onClick={onChange}>Change</button>
    </div>
  );
}
// import Image from "next/image";

// type PropertyCardProps = {
//   title: string;
//   location?: string;
//   rating?: number;
//   ratingLabel?: string;
//   reviewCount?: number;
//   price?: number;
//   nights?: number;
//   total?: number;
//   dateRange?: string;
//   imageUrl: string;
//   variant?: "compact" | "detailed";
//   width?:string
// };

// export default function PropertyCard({
//   title,
//   location,
//   rating,
//   ratingLabel,
//   reviewCount,
//   price,
//   nights,
//   total,
//   dateRange,
//   imageUrl,
//   variant = "compact",
//   width = '250px'
// }: PropertyCardProps) {
//   const isDetailed = variant === "detailed";

//   return (
//     <div
//       className={`rounded-xl border border-gray-300 shadow-sm overflow-hidden relative ${ isDetailed ?`w-[${width}]` :`w-[250px]`} h-full`}
//     >
//       <div className="aspect-[16/9] relative">
//         <Image
//           src={imageUrl}
//           alt="property"
//           width={800}
//           height={800}
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow">
//           <Image src="/svg/heart.svg" alt="heart" width={20} height={20} />
//         </div>
//       </div>

//       <div className="p-4 space-y-1">
//         <h3 className="text-sm font-semibold text-gray-800">{title}</h3>

//         {isDetailed && (
//           <>
//             <p className="text-sm text-gray-500">{location}</p>

//             {rating !== undefined && (
//               <div className="flex items-center gap-2 mt-1">
//                 <span className="text-xs px-2 py-1 bg-green-600 text-white rounded font-bold">
//                   {rating}
//                 </span>
//                 <span className="text-sm font-medium text-gray-800">
//                   {ratingLabel}
//                 </span>
//                 <span className="text-xs text-gray-500">
//                   ({reviewCount} reviews)
//                 </span>
//               </div>
//             )}

//             <div className="mt-2 text-right">
//               <p className="text-lg font-semibold">${price}</p>
//               <p className="text-xs text-gray-600">
//                 ${total} for {nights} nights
//               </p>
//               <p className="text-xs text-gray-500">All fees included</p>
//               <p className="text-xs text-gray-500">{dateRange}</p>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// components/PropertySection.tsx

import { ChevronRight, Heart } from 'lucide-react';
import ScrollSection from './scroll';

import Link from 'next/link';
import Button from '@/shadcn/ui/Button';
import { IListing } from './ui/homepage/store/type';
import ImageComponent from './image/imageComponent';
import { getCookie } from '@/utils/helper';
import axios from 'axios';
import { useToastStore } from '@/lib/store/toast-store';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

// Save to wishlist modal (screenshot style)
function SaveToWishlistModal({ open, onClose, property, onSelectWishlist, onCreateNew }: {
  open: boolean,
  onClose: () => void,
  property: any,
  onSelectWishlist: (wishlistId: string) => void,
  onCreateNew: () => void
}) {
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) return;
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
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl relative overflow-y-auto" style={{
        height: "600px"
      }}>
        <button className="absolute top-3 right-3 text-2xl font-bold" onClick={onClose}>&times;</button>
        <h2 className="text-center text-lg font-semibold mb-6">Save to wishlist</h2>
        <div className="flex items-start mb-6 flex-wrap">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : wishlists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No wishlists found.</div>
          ) : (
            wishlists.map((wl: any) => (
              <div
                key={wl._id}
                className="flex flex-col items-center mb-6 cursor-pointer"
                onClick={() => onSelectWishlist(wl._id)}
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
        <button
          className="mt-2 bg-black text-white py-3 rounded-lg text-lg font-semibold fixed transform -translate-x-1/2 cursor-pointer w-[250px]" style={{
            left: '50%',
            position: 'fixed',
            bottom: '18%'
          }}
          onClick={onCreateNew}
        >
          Create new wishlist
        </button>
      </div>
    </div>
  );
}
// Modal for wishlist name input
const WishlistNameModal = ({ open, onClose, onCreate }: { open: boolean, onClose: () => void, onCreate: (name: string) => void }) => {
  const [name, setName] = useState("");
  const maxChars = 50;
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl relative">
        <button
          className="absolute top-3 right-3 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-center text-lg font-semibold mb-6">Create wishlist</h2>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value.slice(0, maxChars))}
          placeholder="Name"
          className="w-full border rounded-lg px-4 py-3 text-lg mb-2"
          maxLength={maxChars}
          autoFocus
        />
        <div className="text-xs text-gray-500 mb-4">{name.length}/{maxChars} characters</div>
        <div className="flex justify-between items-center mt-6">
          <button
            className="text-gray-700 font-semibold px-4 py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-white ${name.trim() ? 'bg-black' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={!name.trim()}
            onClick={() => { onCreate(name); setName(""); }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

type Props = {
  title?: string;
  properties: IListing[];
  scroll?: boolean;
  width?: string;
  height?: string;
  gridClass?: string;
};

export default function PropertySection({
  title,
  properties,
  scroll = true,
  width = 'w-[194px] md:w-[194px]',
  height = 'h-[184px] md:h-[184px]',
  gridClass = '',
}: Props) {
  console.log('properties:', properties);

  const triggerToast = useToastStore(state => state.triggerToast);
  const [wishlistMap, setWishlistMap] = useState<{ [key: string]: boolean }>({});
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  // Fetch wishlists from API and set wishlistId and wishlistMap
  useEffect(() => {
    const fetchMyWishlists = async () => {
      const token = getCookie("appToken");
      try {
        const response = await axios.get(
          `${baseUrl}wishlist/my-wishlists`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = response.data;
        if (data && data.data && data.data.length > 0) {
          const allWishlists = data.data;
          // Set the first wishlist's id for add/remove
          setWishlistId(allWishlists[0]._id);
          const map: any = {};
          allWishlists.forEach((wishlist: any) => {
            if (Array.isArray(wishlist.listings)) {
              wishlist.listings.forEach((listing: any) => {
                if (listing && listing._id) {
                  map[listing._id] = true;
                }
              });
            }
          });
          setWishlistMap(map);
        }
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchMyWishlists();
  }, []);
  // Toast state
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [savedToastData, setSavedToastData] = useState<{ image: string, wishlistName: string }>({ image: '', wishlistName: '' });
  // Save to wishlist modal state
  const [showSaveToWishlistModal, setShowSaveToWishlistModal] = useState(false);


  const handleAddToWishlist = async () => {
    try {
      const token = getCookie("appToken");

      const response = await axios.post(
        `${baseUrl}wishlist`,
        {
          name: "My Favorite Listings",
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        triggerToast("Added to Wishlist", "success", "top-right");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      triggerToast("Failed to add", "error", "top-right");
    }
  };
  console.log('wishlistId:', wishlistId);

  // Modal state for wishlist name
  const [showWishlistNameModal, setShowWishlistNameModal] = useState(false);
  const [pendingProperty, setPendingProperty] = useState<any>(null);
  const token = getCookie("appToken");


  const toggleWishlist = async (property: any) => {
    // REMOVE IF ALREADY ADDED
    if (wishlistMap[property._id] && wishlistId) {
      try {
        const token = getCookie("appToken");
        await axios.delete(
          `${baseUrl}wishlist/${wishlistId}/remove/${property._id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setWishlistMap(prev => ({ ...prev, [property._id]: false }));
        triggerToast("Removed from wishlist", "success", "top-right");
      } catch (err) {
        console.error(err);
        triggerToast("Something went wrong", "error", "top-right");
      }
      return;
    }
    else {
      try {
        const wishlistsRes = await axios.get(
          `${baseUrl}wishlist/my-wishlists`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const wishlists = wishlistsRes.data?.data || [];
        console.log('Fetched wishlists for toast:', wishlists);
        // Find the wishlist containing this property
        let foundName = name;
        for (const wl of wishlists) {
          if (wl.listings?.some((l: any) => l._id === pendingProperty._id)) {
            foundName = wl.name;
            break;
          }
        }
        if (wishlists.length > 0) {

          setShowSaveToWishlistModal(true);
        }
        else {
          setShowSavedToast(true);
        }
        // setSavedToastData({ image: pendingProperty.images?.[0] 
        //   || '',  wishlistName: foundName
        //    });
      } catch (fetchErr) {
        // setSavedToastData({ image: pendingProperty.images?.[0] || '', wishlistName: name });
      }

      // setSavedToastData({ image: property.images?.[0] || '', wishlistName: '' });
      // setShowSavedToast(true);
    }
    // Show modal for wishlist name
    setPendingProperty(property);
    // setShowWishlistNameModal(true);
  };

  // Handler for creating wishlist with property
  const handleCreateWishlistWithName = async (name: string) => {
    if (!pendingProperty) return;
    try {
      const token = getCookie("appToken");
      const response = await axios.post(
        `${baseUrl}wishlist`,
        {
          name,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const newWishlistId = response.data?.data?._id;
      if (newWishlistId) {
        setWishlistId(newWishlistId);
        // Add the property to the new wishlist
        await axios.post(
          `${baseUrl}wishlist/${newWishlistId}/add`,
          {
            listingId: pendingProperty._id,
          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setWishlistMap(prev => ({ ...prev, [pendingProperty._id]: true }));
      }

      // Fetch wishlists and show the correct name from API
      try {
        const wishlistsRes = await axios.get(
          `${baseUrl}wishlist/my-wishlists`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const wishlists = wishlistsRes.data?.wishlists || [];
        // Find the wishlist containing this property
        let foundName = name;
        for (const wl of wishlists) {
          if (wl.listings?.some((l: any) => l._id === pendingProperty._id)) {
            foundName = wl.name;
            break;
          }
        }
        setSavedToastData({ image: pendingProperty.images?.[0] || '', wishlistName: foundName });
      } catch (fetchErr) {
        setSavedToastData({ image: pendingProperty.images?.[0] || '', wishlistName: name });
      }
      setShowSavedToast(true);
    } catch (err) {
      console.error(err);
      triggerToast("Something went wrong", "error", "top-right");
    }
    setShowWishlistNameModal(false);
    setPendingProperty(null);
  };





  return (
    <section className="mt-3">
      {title && (
        <div className="flex items-center mb-5 gap-1 cursor-pointer">
          <Link href={'/c/category/property'} className="flex items-center">
            <h2 className="text-xl font-semibold flex items-center">{title}</h2>
            <ChevronRight size={18} className="mt-1" />
          </Link>
        </div>
      )}

      {/* Saved to wishlist toast */}
      <SavedToWishlistToast
        open={showSavedToast}
        image={savedToastData.image}
        wishlistName={savedToastData.wishlistName}
        onChange={() => {
          setShowSavedToast(false);
          setShowSaveToWishlistModal(true);
        }}
      />

      {/* Save to wishlist modal (screenshot style) */}
      <SaveToWishlistModal
        open={showSaveToWishlistModal}
        onClose={() => setShowSaveToWishlistModal(false)}
        property={pendingProperty}
        onSelectWishlist={async (wishlistId: string) => {
          // Move property to selected wishlist
          try {
            const token = getCookie("appToken");
            await axios.post(`${baseUrl}wishlist/${wishlistId}/add`, {
              listingId: pendingProperty._id,
            }, {
              headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            setWishlistMap(prev => ({ ...prev, [pendingProperty._id]: true }));
            setShowSaveToWishlistModal(false);
            // Optionally update toast
            const wishlistsRes = await axios.get(
              `${baseUrl}wishlist/my-wishlists`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            const wishlists = wishlistsRes.data?.wishlists || [];
            let foundName = '';
            for (const wl of wishlists) {
              if (wl._id === wishlistId) {
                foundName = wl.name;
                break;
              }
            }
            setSavedToastData({ image: pendingProperty.images?.[0] || '', wishlistName: foundName });
            setShowSavedToast(true);
          } catch (err) {
            // handle error
          }
        }}
        onCreateNew={() => {
          setShowSaveToWishlistModal(false);
          setShowWishlistNameModal(true);
        }}
      />

      <ScrollSection scrollVal={scroll}>
        {
          properties && properties.length > 0 ? (
            <>
              {properties.map((property, index) => (
                <div key={index} className="mb-4 relative">
                  <Button
                    className="absolute top-2 right-2 z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(property);
                    }}
                  >
                    <Heart
                      size={20}
                      className={`${wishlistMap[property._id]
                        ? "fill-red-500 stroke-white stroke-[1.5px]"
                        : "fill-[#00000080] stroke-white stroke-[1.5px]"
                        }`}
                    />
                  </Button>
                  {/* Wishlist Name Modal for creating wishlist with property */}
                  <WishlistNameModal
                    open={showWishlistNameModal}
                    onClose={() => { setShowWishlistNameModal(false); setPendingProperty(null); }}
                    onCreate={handleCreateWishlistWithName}
                  />
                  <Link href={`/rooms/${property?._id}`}>
                    <div
                      className={`${scroll ? 'flex space-x-4 no-scrollbar' : `${gridClass}`}`}
                    >
                      <div
                        className={`${scroll ? 'w-[240px] md:w-[194px] flex-shrink-0' : 'w-full flex-1 min-w-0'}`}
                      >
                        {/* Property Card */}
                        <div
                          className={`${scroll ? `min-w-[240px] md:min-w-[194px]` : ''} bg-white rounded-2xl shadow-sm overflow-hidden`}
                        >
                          <div className="relative">
                            <ImageComponent
                              width={800}
                              height={800}
                              src={property.images[0]}
                              alt={property.title}
                              className={`object-cover ${width} ${height}`}
                            />

                          </div>
                        </div>
                        <div className="p-3 space-y-1">
                          <h3 className="text-[13px] font-semibold">
                            {property.title || 'Unknown'}
                          </h3>

                          <p className="text-[12px] text-gray-500">
                            <span className="font-semibold">
                              ₹
                              {property.weekdayBasePrice
                                ? property.weekdayBasePrice * 2
                                : '99'}{' '}
                              for 2 nights
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

            </>) : "No properties found."
        }

      </ScrollSection>
    </section>
  );
}
