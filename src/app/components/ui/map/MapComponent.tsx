'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import {
  Plus,
  Minus,
  Heart,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';

interface MapComponentProps {
  centerLat?: string;
  centerLng?: string;
  location?: string;
}

interface PropertyMarker {
  id: number;
  lat: number;
  lng: number;
  price: string;
  title: string;
  location: string;
  rating: number;
  beds: number;
  priceForNights: string;
  nights: number;
  image: string;
  images?: string[];
  isHighlighted?: boolean;
}

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Default map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export default function MapComponent({
  centerLat,
  centerLng,
  location,
}: MapComponentProps) {
  const [zoom, setZoom] = useState(12);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<PropertyMarker | null>(
    null
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Default center (Madurai, India)
  const defaultCenter = {
    lat: parseFloat(centerLat || '9.9252'),
    lng: parseFloat(centerLng || '78.1198'),
  };

  // Sample property markers based on the location (using real coordinates around Madurai)
  const propertyMarkers: PropertyMarker[] = [
    {
      id: 1,
      lat: 9.9252,
      lng: 78.1198,
      price: '₹79,700',
      title: 'Room in Madurai',
      location: 'Newly Built Stylish Full House with 1BHK...',
      rating: 5.0,
      beds: 1,
      priceForNights: '₹86,730 for 16 nights',
      nights: 16,
      image: '/images/bedroom.png',
      images: [
        '/images/bedroom.png',
        '/images/bathroom.png',
        '/images/host.png',
        '/images/herosection.avif',
        '/images/bg.jpg',
      ],
    },
    {
      id: 2,
      lat: 9.9312,
      lng: 78.1245,
      price: '₹26,421',
      title: 'Cozy Apartment',
      location: 'Beautiful apartment near temple complex',
      rating: 4.8,
      beds: 2,
      priceForNights: '₹26,421 for 10 nights',
      nights: 10,
      image: '/images/bedroom.png',
      images: [
        '/images/bedroom.png',
        '/images/bathroom.png',
        '/images/book.avif',
        '/images/connect.avif',
      ],
    },
    {
      id: 3,
      lat: 9.919,
      lng: 78.1156,
      price: '₹42,623',
      title: 'Modern Flat',
      location: 'Contemporary flat with modern amenities',
      rating: 4.5,
      beds: 1,
      priceForNights: '₹42,623 for 12 nights',
      nights: 12,
      image: '/images/bedroom.png',
      images: [
        '/images/bedroom.png',
        '/images/bathroom.png',
        '/images/trip.avif',
        '/images/camera.avif',
      ],
    },
    {
      id: 4,
      lat: 9.9285,
      lng: 78.1289,
      price: '₹72,744',
      title: 'Heritage Home',
      location: 'Traditional heritage home experience',
      rating: 4.9,
      beds: 3,
      priceForNights: '₹72,744 for 14 nights',
      nights: 14,
      image: '/images/bedroom.png',
      images: [
        '/images/bedroom.png',
        '/images/bathroom.png',
        '/images/herosection.avif',
        '/images/verification.avif',
        '/images/step1.jpg',
      ],
    },
    {
      id: 5,
      lat: 9.9201,
      lng: 78.1089,
      price: '₹86,730',
      title: 'Premium Studio',
      location: 'Luxury studio apartment in prime location',
      rating: 4.7,
      beds: 1,
      priceForNights: '₹86,730 for 18 nights',
      nights: 18,
      image: '/images/bedroom.png',
      images: ['/images/bedroom.png', '/images/bathroom.png', '/images/bg.jpg'],
    },
    {
      id: 6,
      lat: 9.9178,
      lng: 78.1267,
      price: '₹28,293',
      title: 'Budget Room',
      location: 'Affordable and comfortable accommodation',
      rating: 4.2,
      beds: 1,
      priceForNights: '₹28,293 for 8 nights',
      nights: 8,
      image: '/images/bedroom.png',
      images: [
        '/images/bedroom.png',
        '/images/bathroom.png',
        '/images/step0.webp',
      ],
    },
    {
      id: 7,
      lat: 9.9334,
      lng: 78.1134,
      price: '₹56,146',
      title: 'Family Home',
      location: 'Spacious home perfect for families',
      rating: 4.6,
      beds: 4,
      priceForNights: '₹56,146 for 12 nights',
      nights: 12,
      image: '/images/bedroom.png',
      images: [
        '/images/bedroom.png',
        '/images/bathroom.png',
        '/images/host.png',
        '/images/herosection.avif',
      ],
    },
    {
      id: 8,
      lat: 9.9267,
      lng: 78.1178,
      price: '₹34,875',
      title: 'Central Flat',
      location: 'Centrally located modern apartment',
      rating: 4.4,
      beds: 2,
      priceForNights: '₹34,875 for 9 nights',
      nights: 9,
      image: '/images/bedroom.png',
      images: [
        '/images/bedroom.png',
        '/images/bathroom.png',
        '/images/connect.avif',
      ],
    },
    {
      id: 9,
      lat: 9.9298,
      lng: 78.1223,
      price: '₹41,247',
      title: 'Garden Villa',
      location: 'Beautiful villa with garden views',
      rating: 4.8,
      beds: 3,
      priceForNights: '₹41,247 for 11 nights',
      nights: 11,
      image: '/images/bedroom.png',
      images: [
        '/images/bedroom.png',
        '/images/bathroom.png',
        '/images/trip.avif',
        '/images/book.avif',
      ],
    },
    {
      id: 10,
      lat: 9.9156,
      lng: 78.1201,
      price: '₹24,932',
      title: 'Guest House',
      location: 'Comfortable and welcoming guest house',
      rating: 4.3,
      beds: 1,
      priceForNights: '₹24,932 for 7 nights',
      nights: 7,
      image: '/images/bedroom.png',
      images: [
        '/images/bedroom.png',
        '/images/bathroom.png',
        '/images/camera.avif',
      ],
    },
  ];

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 12;
      map.setZoom(Math.min(currentZoom + 1, 18));
      setZoom(Math.min(currentZoom + 1, 18));
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 12;
      map.setZoom(Math.max(currentZoom - 1, 1));
      setZoom(Math.max(currentZoom - 1, 1));
    }
  };

  const handleMarkerClick = (marker: PropertyMarker) => {
    setSelectedMarker(marker);
    setCurrentImageIndex(0);
    setIsFavorited(false);
    setIsAutoPlaying(false);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
    setCurrentImageIndex(0);
    setIsAutoPlaying(false);
  };

  const handleImageNavigation = React.useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedMarker?.images) return;

      setIsAutoPlaying(false); // Stop auto-play when user manually navigates

      if (direction === 'next') {
        setCurrentImageIndex(prev =>
          prev === selectedMarker.images!.length - 1 ? 0 : prev + 1
        );
      } else {
        setCurrentImageIndex(prev =>
          prev === 0 ? selectedMarker.images!.length - 1 : prev - 1
        );
      }
    },
    [selectedMarker]
  );

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (
      isLeftSwipe &&
      selectedMarker?.images &&
      selectedMarker.images.length > 1
    ) {
      handleImageNavigation('next');
    } else if (
      isRightSwipe &&
      selectedMarker?.images &&
      selectedMarker.images.length > 1
    ) {
      handleImageNavigation('prev');
    }
  };

  // Auto-play functionality
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (
      isAutoPlaying &&
      selectedMarker?.images &&
      selectedMarker.images.length > 1
    ) {
      intervalId = setInterval(() => {
        setCurrentImageIndex(prev =>
          prev === selectedMarker.images!.length - 1 ? 0 : prev + 1
        );
      }, 3000); // Change image every 3 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoPlaying, selectedMarker]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!selectedMarker?.images) return;

      if (event.key === 'ArrowLeft') {
        handleImageNavigation('prev');
      } else if (event.key === 'ArrowRight') {
        handleImageNavigation('next');
      } else if (event.key === 'Escape') {
        handleInfoWindowClose();
      }
    };

    if (selectedMarker) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedMarker, handleImageNavigation]);

  // Custom marker icon for price display
  const createPriceMarker = (price: string) => {
    // Check if Google Maps is loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="116" height="36" rx="18" fill="white" stroke="#e5e7eb" stroke-width="1"/>
                        <text x="60" y="25" font-family="Arial, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#1f2937">${price}</text>
                    </svg>
                `)}`,
        scaledSize: new window.google.maps.Size(120, 40),
        anchor: new window.google.maps.Point(60, 40),
      };
    }
    // Return undefined if Google Maps is not loaded yet
    return undefined;
  };

  return (
    <div className="w-full h-full relative">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_MAP_API_KEY || ''}
        onLoad={() => setIsLoaded(true)}
        loadingElement={
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
          onZoomChanged={() => {
            if (map) {
              setZoom(map.getZoom() || 12);
            }
          }}
        >
          {/* Property Markers - Only render when map is loaded */}
          {isLoaded &&
            propertyMarkers.map(marker => {
              const markerIcon = createPriceMarker(marker.price);
              return (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => handleMarkerClick(marker)}
                  icon={markerIcon || undefined}
                  label={
                    !markerIcon
                      ? {
                          text: marker.price,
                          color: '#1f2937',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }
                      : undefined
                  }
                />
              );
            })}

          {/* Info Window */}
          {selectedMarker && (
            <InfoWindow
              position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
              onCloseClick={handleInfoWindowClose}
              options={{
                pixelOffset: new window.google.maps.Size(0, -40),
                disableAutoPan: false,
                maxWidth: 350,
              }}
            >
              <div className="w-80 bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Image Carousel Section */}
                <div
                  className="relative h-48 bg-gray-200 overflow-hidden cursor-grab active:cursor-grabbing"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Image Container with smooth transitions */}
                  <div
                    className="flex transition-transform duration-300 ease-in-out h-full"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                      width: `${(selectedMarker.images?.length || 1) * 100}%`,
                    }}
                  >
                    {selectedMarker.images &&
                    selectedMarker.images.length > 0 ? (
                      selectedMarker.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-full h-full flex-shrink-0"
                        >
                          <Image
                            src={image}
                            alt={`${selectedMarker.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            width={400}
                            height={192}
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                '/images/default.jpg';
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-full flex-shrink-0">
                        <Image
                          src={selectedMarker.image}
                          alt={selectedMarker.title}
                          className="w-full h-full object-cover"
                          width={400}
                          height={192}
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              '/images/default.jpg';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Top Controls */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                    <div className="flex space-x-2">
                      <button
                        onClick={toggleFavorite}
                        className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-700'}`}
                        />
                      </button>
                      {selectedMarker.images &&
                        selectedMarker.images.length > 1 && (
                          <button
                            onClick={toggleAutoPlay}
                            className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
                            title={
                              isAutoPlaying
                                ? 'Pause slideshow'
                                : 'Start slideshow'
                            }
                          >
                            <div
                              className={`w-3 h-3 ${isAutoPlaying ? 'bg-gray-700' : ''}`}
                            >
                              {isAutoPlaying ? (
                                <div className="flex space-x-0.5">
                                  <div className="w-1 h-3 bg-gray-700"></div>
                                  <div className="w-1 h-3 bg-gray-700"></div>
                                </div>
                              ) : (
                                <div className="w-0 h-0 border-l-[6px] border-l-gray-700 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                              )}
                            </div>
                          </button>
                        )}
                    </div>
                    <button
                      onClick={handleInfoWindowClose}
                      className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  {/* Image Counter */}
                  {selectedMarker.images &&
                    selectedMarker.images.length > 1 && (
                      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs z-10">
                        {currentImageIndex + 1} / {selectedMarker.images.length}
                      </div>
                    )}

                  {/* Navigation Dots */}
                  {selectedMarker.images &&
                    selectedMarker.images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {selectedMarker.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                              index === currentImageIndex
                                ? 'bg-white shadow-lg scale-110'
                                : 'bg-white/60 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                  {/* Navigation Arrows */}
                  {selectedMarker.images &&
                    selectedMarker.images.length > 1 && (
                      <>
                        <button
                          onClick={() => handleImageNavigation('prev')}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 z-10"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleImageNavigation('next')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 z-10"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-700" />
                        </button>
                      </>
                    )}

                  {/* Auto-play Progress Bar */}
                  {isAutoPlaying &&
                    selectedMarker.images &&
                    selectedMarker.images.length > 1 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-10">
                        <div
                          className="h-full bg-white transition-all duration-100 ease-linear"
                          style={{
                            width: `${((currentImageIndex + 1) / selectedMarker.images.length) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4">
                  {/* Title and Rating */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {selectedMarker.title}
                    </h3>
                    <div className="flex items-center ml-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-700 ml-1">
                        {selectedMarker.rating.toFixed(1)} (
                        {Math.floor(Math.random() * 100) + 1})
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <p
                    className="text-gray-600 text-sm mb-2 overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                    }}
                  >
                    {selectedMarker.location}
                  </p>

                  {/* Bed Info */}
                  <p className="text-gray-600 text-sm mb-3">
                    {selectedMarker.beds} bed
                    {selectedMarker.beds > 1 ? 's' : ''}
                  </p>

                  {/* Price */}
                  <div className="border-t pt-3">
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedMarker.priceForNights}
                    </p>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Custom Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <button
          onClick={handleZoomIn}
          className="bg-white rounded-md p-2 shadow-lg hover:bg-gray-50 transition-colors border"
          title="Zoom In"
        >
          <Plus className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white rounded-md p-2 shadow-lg hover:bg-gray-50 transition-colors border"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Location Info */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10 border">
        <div className="text-sm font-medium text-gray-900">
          {location || 'Map View'}
        </div>
        {centerLat && centerLng && (
          <div className="text-xs text-gray-500 mt-1">
            {centerLat}, {centerLng}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">Zoom: {zoom}x</div>
      </div>

      {/* Selected Property Info */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10 border max-w-xs">
          <h3 className="font-semibold text-sm text-gray-900">
            {selectedMarker.title}
          </h3>
          <p className="text-lg font-bold text-pink-600 mt-1">
            {selectedMarker.price}
          </p>
          <button className="mt-2 px-3 py-1 bg-pink-500 text-white rounded text-sm hover:bg-pink-600 transition-colors">
            View Details
          </button>
        </div>
      )}
    </div>
  );
}
