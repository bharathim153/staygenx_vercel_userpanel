import { useGlobalStore } from '@/lib/store/global-store';

export async function loadGoogleMapsScript() {
  const key = process.env.NEXT_PUBLIC_MAP_API_KEY;

  if (!key) {
    return;
  }

  // If the Google Maps script hasn't been loaded, load it manually
  if (!window.google?.maps) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Now import specific modules (modular way)
  // const { Autocomplete } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

  // Optional: update your store
  useGlobalStore.getState().setGooglemapLoader(true);
}
