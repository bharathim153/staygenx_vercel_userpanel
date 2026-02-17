// 'use client';

import PropertyPage from '@/app/components/ui/propertypage';

// import { useSearchParams } from 'next/navigation';
// import { Suspense, useState } from 'react';
// import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
// import dynamic from 'next/dynamic';

// // Dynamically import the Map component
// const MapComponent = dynamic(
//     () => import('../../components/ui/map/MapComponent'),
//     { ssr: false }
// );

// function SearchResultsContent() {
//     const searchParams = useSearchParams();
//     const [favorites, setFavorites] = useState<number[]>([]);
//     const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: number]: number }>({});

//     // Extract search parameters
//     const location = searchParams.get('location') || 'Unknown Location';
//     const centerLat = searchParams.get('center_lat') || '';
//     const centerLng = searchParams.get('center_lng') || '';
//     const checkin = searchParams.get('checkin') || '';
//     const checkout = searchParams.get('checkout') || '';
//     const adults = searchParams.get('adults') || '1';
//     const children = searchParams.get('children') || '0';
//     const infants = searchParams.get('infants') || '0';
//     const pets = searchParams.get('pets') || '0';

//     const toggleFavorite = (id: number) => {
//         setFavorites(prev =>
//             prev.includes(id)
//                 ? prev.filter(fav => fav !== id)
//                 : [...prev, id]
//         );
//     };

//     const handleImageNavigation = (propertyId: number, direction: 'prev' | 'next', images: string[]) => {
//         setCurrentImageIndices(prev => {
//             const currentIndex = prev[propertyId] || 0;
//             let newIndex;

//             if (direction === 'next') {
//                 newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
//             } else {
//                 newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
//             }

//             return {
//                 ...prev,
//                 [propertyId]: newIndex
//             };
//         });
//     };

//     const properties = [
//         {
//             id: 1,
//             title: "Room in Madurai",
//             subtitle: "Comfy spacious bedroom for women",
//             beds: "1 double bed",
//             price: "₹26,421",
//             originalPrice: null,
//             duration: "for 16 nights",
//             rating: 4.7,
//             reviews: 37,
//             image: "/images/bedroom.png",
//             images: ["/images/bedroom.png", "/images/bathroom.png", "/images/herosection.avif", "/images/bg.jpg", "/images/host.png"],
//             badge: "Guest favourite",
//             isNew: false
//         },
//         {
//             id: 2,
//             title: "Hotel room in Nagamalaiipudukottai",
//             subtitle: "Hotel O Nagamalaiipudukottai Madurai",
//             beds: "1 bedroom · 1 bed",
//             price: "₹21,121",
//             originalPrice: null,
//             duration: "for 16 nights",
//             rating: null,
//             reviews: null,
//             image: "/images/bedroom.png",
//             images: ["/images/bedroom.png", "/images/bathroom.png", "/images/book.avif", "/images/connect.avif"],
//             badge: null,
//             isNew: true
//         },
//         {
//             id: 3,
//             title: "Flat in Madurai",
//             subtitle: "Harmony Home. Serenity reigns Welcome to...",
//             beds: "1 bedroom · 2 beds",
//             price: "₹42,622",
//             originalPrice: "₹46,779",
//             duration: "for 16 nights",
//             rating: null,
//             reviews: null,
//             image: "/images/bedroom.png",
//             images: ["/images/bedroom.png", "/images/bathroom.png", "/images/trip.avif", "/images/camera.avif", "/images/verification.avif"],
//             badge: null,
//             isNew: true
//         },
//         {
//             id: 4,
//             title: "Flat in Madurai",
//             subtitle: "Day One Original - Luxury Studio Home",
//             beds: "1 bedroom · 2 beds",
//             price: "₹56,146",
//             originalPrice: null,
//             duration: "for 16 nights",
//             rating: 4.82,
//             reviews: 28,
//             image: "/images/bedroom.png",
//             images: ["/images/bedroom.png", "/images/bathroom.png", "/images/step1.jpg", "/images/herosection.avif"],
//             badge: "Superhost",
//             isNew: false
//         },
//         {
//             id: 5,
//             title: "Room in Madurai",
//             subtitle: "A Spacious home in Madurai",
//             beds: "1 queen bed",
//             price: "₹28,279",
//             originalPrice: "₹30,999",
//             duration: "for 16 nights",
//             rating: 4.35,
//             reviews: 54,
//             image: "/images/bedroom.png",
//             images: ["/images/bedroom.png", "/images/bathroom.png", "/images/bg.jpg", "/images/step0.webp"],
//             badge: null,
//             isNew: false
//         },
//         {
//             id: 6,
//             title: "Flat in Madurai",
//             subtitle: "Royal Apartment, TM Nagar",
//             beds: "2 bedrooms · 2 beds",
//             price: "₹72,744",
//             originalPrice: "₹80,560",
//             duration: "for 16 nights",
//             rating: null,
//             reviews: null,
//             image: "/images/bedroom.png",
//             images: ["/images/bedroom.png", "/images/bathroom.png", "/images/host.png", "/images/connect.avif", "/images/trip.avif"],
//             badge: null,
//             isNew: true
//         }
//     ];

//     return (
//         <div className="min-h-screen bg-white">
//             {/* Header */}
//             <div className="bg-white border-b px-6 py-4">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-sm font-medium text-gray-900">
//                             71 homes
//                         </h1>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2 bg-white border rounded-full px-4 py-2">
//                             <Heart className="w-4 h-4 text-pink-500 fill-current" />
//                             <span className="text-sm font-medium">Prices include all fees</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex h-[calc(100vh-80px)] flex-wrap">
//                 {/* Left Panel - Property Cards */}
//                 <div className="md:w-1/2 overflow-y-auto p-6">
//                     <div className="grid md:grid-cols-3 gap-4">
//                         {properties.map((property) => (
//                             <div key={property.id} className="relative bg-white rounded-lg overflow-hidden group">
//                                 {/* Image Container with Carousel */}
//                                 <div className="relative w-full h-70 overflow-hidden rounded-[20px]">
//                                     {/* Image Carousel */}
//                                     <div
//                                         className="flex transition-transform duration-300 ease-in-out h-full"
//                                         style={{
//                                             transform: `translateX(-${(currentImageIndices[property.id] || 0) * 100}%)`,
//                                             width: `${property.images.length * 100}%`
//                                         }}
//                                     >
//                                         {property.images.map((image, index) => (
//                                             <div key={index} className="w-full h-full flex-shrink-0">
//                                                 <img
//                                                     src={image}
//                                                     alt={`${property.title} - Image ${index + 1}`}
//                                                     className="w-full h-600 object-cover"
//                                                     onError={(e) => {
//                                                         (e.target as HTMLImageElement).src = '/images/default.jpg';
//                                                     }}
//                                                 />
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Navigation Arrows */}
//                                     {property.images.length > 1 && (
//                                         <>
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     handleImageNavigation(property.id, 'prev', property.images);
//                                                 }}
//                                                 className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 z-10"
//                                             >
//                                                 <ChevronLeft className="w-3 h-3 text-gray-700" />
//                                             </button>
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     handleImageNavigation(property.id, 'next', property.images);
//                                                 }}
//                                                 className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 z-10"
//                                             >
//                                                 <ChevronRight className="w-3 h-3 text-gray-700" />
//                                             </button>
//                                         </>
//                                     )}

//                                     {/* Heart Icon */}
//                                     <button
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             toggleFavorite(property.id);
//                                         }}
//                                         className="absolute top-2 right-2 p-1 z-10"
//                                     >
//                                         <Heart
//                                             className={`w-5 h-5 ${favorites.includes(property.id)
//                                                 ? 'text-pink-500 fill-current'
//                                                 : 'text-white'
//                                                 }`}
//                                         />
//                                     </button>

//                                     {/* Badge */}
//                                     {property.badge && (
//                                         <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium z-10 ${property.badge === 'Guest favourite'
//                                             ? 'bg-white text-gray-900'
//                                             : 'bg-gray-900 text-white'
//                                             }`}>
//                                             {property.badge}
//                                         </div>
//                                     )}

//                                     {/* New Badge */}
//                                     {property.isNew && (
//                                         <div className="absolute top-2 right-8 bg-white text-gray-900 px-2 py-1 rounded text-xs font-medium z-10">
//                                             New
//                                         </div>
//                                     )}

//                                     {/* Image Counter */}
//                                     {property.images.length > 1 && (
//                                         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-0.5 rounded-full text-xs z-10">
//                                             {(currentImageIndices[property.id] || 0) + 1} / {property.images.length}
//                                         </div>
//                                     )}

//                                     {/* Image Dots */}
//                                     <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
//                                         {property.images.map((_, i) => (
//                                             <button
//                                                 key={i}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     setCurrentImageIndices(prev => ({
//                                                         ...prev,
//                                                         [property.id]: i
//                                                     }));
//                                                 }}
//                                                 className={`w-1 h-1 rounded-full transition-all duration-200 ${i === (currentImageIndices[property.id] || 0)
//                                                     ? 'bg-white scale-125'
//                                                     : 'bg-white/50 hover:bg-white/80'
//                                                     }`}
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Content */}
//                                 <div className="pt-2 px-1">
//                                     <div className="flex justify-between items-start mb-1">
//                                         <h3 className="font-medium text-gray-900 text-xs leading-tight">
//                                             {property.title}
//                                         </h3>
//                                         {property.rating && (
//                                             <div className="flex items-center ml-1">
//                                                 <Star className="w-2.5 h-2.5 text-gray-900 fill-current mr-0.5" />
//                                                 <span className="text-xs text-gray-900">
//                                                     {property.rating}
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <p className="text-gray-500 text-xs mb-1 overflow-hidden" style={{
//                                         display: '-webkit-box',
//                                         WebkitLineClamp: 2,
//                                         WebkitBoxOrient: 'vertical'
//                                     }}>
//                                         {property.subtitle}
//                                     </p>

//                                     <p className="text-gray-500 text-xs mb-2">
//                                         {property.beds}
//                                     </p>

//                                     <div className="flex items-baseline space-x-1">
//                                         {property.originalPrice && (
//                                             <span className="text-gray-500 text-xs line-through">
//                                                 {property.originalPrice}
//                                             </span>
//                                         )}
//                                         <span className="font-medium text-gray-900 text-xs">
//                                             {property.price}
//                                         </span>
//                                         <span className="text-gray-500 text-xs">
//                                             {property.duration.replace('for 16 nights', 'night')}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Right Panel - Map */}
//                 <div className="md:w-1/2 relative w-[100%] h-full">
//                     <MapComponent
//                         centerLat={centerLat}
//                         centerLng={centerLng}
//                         location={location}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function SearchPage() {
//     return (
//         <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading search results...</div>}>
//             <SearchResultsContent />
//         </Suspense>
//     );
// }

export default function Property() {
  return (
    <div className="">
      <PropertyPage />
    </div>
  );
}
