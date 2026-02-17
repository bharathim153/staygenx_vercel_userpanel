import { useGlobalStore } from '@/lib/store/global-store';

export const getGridCols = (width: number): string => {
  if (!width) return 'grid-cols-1';
  // if (width >= 1800) return 'grid-cols-6';
  // if (width >= 1600) return 'grid-cols-5';
  if (width >= 1024) return 'grid-cols-3';
  if (width >= 768) return 'grid-cols-2';
  if (width >= 600) return 'grid-cols-2';
  return 'grid-cols-1';
};

export function setCookie(cname: string, cvalue: string, exdays: number): void {
  if (typeof window !== 'undefined') {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/`;
  }
}

export function getCookie(cname: string): string {
  if (typeof window !== 'undefined') {
    const name = `${cname}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
  }
  return '';
}

export function clearAllCookies(): void {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name =
        eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
    window.location.href = '/';
    useGlobalStore?.getState().setIsLoggedIn(false);
  }
}

export const fetchAddress = async (
  placeId: string
): Promise<{
  lat: number;
  lng: number;
  address: string;
  street: string;
  country: string;
  state: string;
  city: string;
  district: string;
  pincode: string;
}> => {
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    service.getDetails(
      { placeId },
      (place: google.maps.places.PlaceResult | null, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || '';

          const components = place.address_components || [];

          const getComponent = (type: string) =>
            components.find(c => c.types.includes(type))?.long_name || '';

          const streetNumber = getComponent('street_number');
          const route = getComponent('route');
          const street = [streetNumber, route].filter(Boolean).join(' '); // e.g., "123 MG Road"

          const result = {
            lat,
            lng,
            address,
            street,
            country: getComponent('country'),
            state: getComponent('administrative_area_level_1'),
            city: getComponent('locality'),
            district:
              getComponent('sublocality_level_1') || getComponent('locality'),
            pincode: getComponent('postal_code'),
          };

          resolve(result);
        } else {
          reject(new Error(`Place details request failed: ${status}`));
        }
      }
    );
  });
};

// export const fetchAddress = async (
//   placeId: string
// ): Promise<{
//   lat: number;
//   lng: number;
//   address: string;
//   street: string;
//   country: string;
//   state: string;
//   city: string;
//   district: string;
//   pincode: string;
// }> => {
//   return new Promise((resolve, reject) => {
//     const service = new window.google.maps.places.PlacesService(
//       document.createElement('div')
//     );

//     service.getDetails(
//       { placeId },
//       (place: google.maps.places.PlaceResult | null, status) => {
//         if (
//           status === window.google.maps.places.PlacesServiceStatus.OK &&
//           place?.geometry?.location
//         ) {
//           const lat = place.geometry.location.lat();
//           const lng = place.geometry.location.lng();
//           const address = place.formatted_address || '';

//           const components = place.address_components || [];

//           const getComponent = (type: string) =>
//             components.find(c => c.types.includes(type))?.long_name || '';

//           const streetNumber = getComponent('street_number');
//           const route = getComponent('route');
//           const street = [streetNumber, route].filter(Boolean).join(' '); // e.g., "123 MG Road"

//           const result = {
//             lat,
//             lng,
//             address,
//             street,
//             country: getComponent('country'),
//             state: getComponent('administrative_area_level_1'),
//             city: getComponent('locality'),
//             district:
//               getComponent('sublocality_level_1') || getComponent('locality'),
//             pincode: getComponent('postal_code'),
//           };

//           resolve(result);
//         } else {
//           reject(new Error(`Place details request failed: ${status}`));
//         }
//       }
//     );
//   });
// };

export function generateGoogleOAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL || '',
    scope: 'profile email',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    state: 'googleHost',
  });

  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
  return googleOAuthUrl;
}

export function deepEqual<T>(obj1: T, obj2: T): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1) as Array<keyof T>;
  const keys2 = Object.keys(obj2) as Array<keyof T>;

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;

    const val1 = obj1[key];
    const val2 = obj2[key];

    if (!deepEqual(val1, val2)) return false;
  }

  return true;
}
