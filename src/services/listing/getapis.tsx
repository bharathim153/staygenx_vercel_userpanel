import { useListingStore } from '@/app/components/ui/create-listings/store';
import {
  AmenityApiData,
  useAmenityStore,
} from '@/app/components/ui/create-listings/store/amenities';
import { useHouseruleStore } from '@/app/components/ui/create-listings/store/houserules';
import {
  SpaceData,
  useSpaceStore,
} from '@/app/components/ui/create-listings/store/space';
import { ListingTypes, useListeStore } from '@/app/components/ui/hosting/store';
import APICONSTANT from '@/utils/apiconstant';
import { ApiResponse } from '@/utils/apiresponse';
import { Request } from '@/utils/request';

export async function CategoryApi() {
  try {
    const response = await Request<ApiResponse>(
      `${APICONSTANT.category}`,
      'GET'
    );
    return response?.data?.data as ApiResponse;
  } catch (error) {
    throw error;
  }
}

export async function PropertyTypeApi() {
  try {
    const response = await Request<ApiResponse>(
      `${APICONSTANT.propertytypes}`,
      'GET'
    );
    return response?.data?.data as ApiResponse;
  } catch (error) {
    throw error;
  }
}

export async function SpaceApi() {
  try {
    const response = await Request<ApiResponse>(`${APICONSTANT.space}`, 'GET');
    if (
      response?.data?.statusCode === 200 &&
      Array.isArray(response.data.data)
    ) {
      useSpaceStore.getState().setSpace(response.data.data as SpaceData[]);
    }
    return response?.data?.data as ApiResponse;
  } catch (error) {
    throw error;
  }
}

export async function HouseRulesApi() {
  try {
    const response = await Request<ApiResponse>(
      `${APICONSTANT.houserules}`,
      'GET'
    );
    useHouseruleStore
      .getState()
      .setHouseRules(
        Array.isArray(response?.data?.data) ? response.data.data : []
      );
    return response?.data?.data as ApiResponse;
  } catch (error) {
    throw error;
  }
}

export async function AmenityApi() {
  debugger;
  try {
    const response = await Request<ApiResponse<AmenityApiData[]>>(
      `${APICONSTANT.amenities}`,
      'GET'
    );

    const amenityList = response?.data?.data;
    console.log('Fetched Amenity List:', amenityList);
    if (Array.isArray(amenityList)) {
      useAmenityStore.getState().setAmenity(amenityList); // ✅ Correct typing
      // Return only the array of amenity IDs for payload
      // return amenityList.map(a => a._id);
      return amenityList;
    }
    return [];
  } catch (error) {
    throw error;
  }
}

export async function SingleListing(data: { listingId: string }) {
  useListingStore.getState().setloading(true);
  try {
    const response = await Request<ApiResponse<ListingTypes>>(
      `${APICONSTANT.listings}/${data?.listingId}`,
      'GET'
    );
    if (response?.data?.statusCode === 200) {
      useListingStore.getState().setloading(false);
      useListingStore.getState().SetListingData({
        categories: {
          category:
            typeof response?.data?.data?.category?._id === 'string'
              ? response.data.data?.category?._id
              : '',
        },
        propertytype: {
          propertyType:
            typeof response?.data?.data?.propertyType === 'string'
              ? response.data?.data?.propertyType
              : '',
        },
        amenities: {
          amenities: Array.isArray(response?.data?.data?.amenities)
            ? response?.data?.data?.amenities
            : [],
        },
        houseRule: {
          houseRules: Array.isArray(response?.data?.data?.houseRules)
            ? response?.data?.data?.houseRules
            : [],
          hasFirstAidKit: response?.data?.data?.hasFirstAidKit ?? false,
          hasSmokeAlarm: response?.data?.data?.hasSmokeAlarm ?? false,
          cancellationPolicy: response?.data?.data?.cancellationPolicy ?? '',
        },
        documentVerification: {
          _id: response?.data?.data?.documentVerification?._id ?? '',
          listingId: response?.data?.data?._id ?? '',
          documentType:
            response?.data?.data?.documentVerification?.documentType ?? '',
          frontImage:
            response?.data?.data?.documentVerification?.frontImage ?? '',
          backImage:
            response?.data?.data?.documentVerification?.backImage ?? '',
          status: response?.data?.data?.documentVerification?.status ?? '',
          createdAt:
            response?.data?.data?.documentVerification?.createdAt ?? '',
          updatedAt:
            response?.data?.data?.documentVerification?.updatedAt ?? '',
          __v: response?.data?.data?.documentVerification?.__v ?? 0,
        },
        arrivalguide: {
          ...(response?.data?.data?.arrivalGuide ?? {
            checkInTime: '',
            checkOutTime: '',
            checkInMethod: '',
            wifiDetails: {
              networkName: '',
              password: '',
            },
            checkoutInstructions: [],
          }),
        },
        photoTour: response?.data?.data?.photoTour ?? [
          {
            roomType: '',
            roomTypeName: '',
            photos: [],
            sleepingArrangements: [],
            _id: '',
          },
        ],
        uploadimage: {
          images: [],
          preview: [],
        },
        images: Array.isArray(response?.data?.data?.images)
          ? response.data.data?.images
          : [],
        description: {
          title:
            typeof response?.data?.data?.title === 'string'
              ? response.data.data?.title
              : '',
          description:
            typeof response?.data?.data?.description === 'string'
              ? response.data.data?.description
              : '',
        },
        bookingmode: {
          bookingMode:
            typeof response?.data?.data?.bookingMode === 'string'
              ? response.data.data?.bookingMode
              : '',
        },
        baseprice: {
          weekday:
            typeof response?.data?.data?.weekdayBasePrice === 'number'
              ? response.data.data?.weekdayBasePrice
              : 0,
          weekend:
            typeof response?.data?.data?.weekendBasePrice === 'number'
              ? response.data.data?.weekendBasePrice
              : 0,
        },
        location: {
          lat:
            typeof response?.data?.data?.lat === 'number'
              ? response.data.data?.lat
              : 0,
          lng:
            typeof response?.data?.data?.lng === 'number'
              ? response.data.data?.lng
              : 0,
          address:
            typeof response?.data?.data?.address === 'string'
              ? response.data.data?.address
              : '',
          country:
            typeof response?.data?.data?.country === 'string'
              ? response.data.data?.country
              : '',
          // landmark: typeof response?.data?.data?.landmark === 'string' ? response.data.data?.landmark : '',
          // district: typeof response?.data?.data?.district === 'string' ? response.data.data?.district : '',
          city:
            typeof response?.data?.data?.city === 'string'
              ? response.data.data?.city
              : '',
          state:
            typeof response?.data?.data?.state === 'string'
              ? response.data.data?.state
              : '',
          pincode:
            typeof response?.data?.data?.pincode === 'string'
              ? response.data.data?.pincode
              : '',
          // street: typeof response?.data?.data?.street === 'string' ? response.data.data?.street : '',
        },
        floorplan: {
          adults:
            typeof response?.data?.data?.adults === 'number'
              ? response.data.data?.adults
              : 1,
          children:
            typeof response?.data?.data?.children === 'number'
              ? response.data.data?.children
              : 0,
          infants:
            typeof response?.data?.data?.infants === 'number'
              ? response.data.data?.infants
              : 0,
          bedrooms:
            typeof response?.data?.data?.bedrooms === 'number'
              ? response.data.data?.bedrooms
              : 2,
          beds:
            typeof response?.data?.data?.beds === 'number'
              ? response.data.data?.beds
              : 2,
          bathrooms:
            typeof response?.data?.data?.bathrooms === 'number'
              ? response.data.data?.bathrooms
              : 1,
          pets:
            typeof response?.data?.data?.pets === 'boolean'
              ? response.data.data?.pets
              : false,
        },
        listingId: response?.data?.data?._id,
      });
    }
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function Listings() {
  try {
    useListeStore.getState().setloading(true);
    const response = await Request<ApiResponse<ListingTypes[]>>(
      `${APICONSTANT.providers}`,
      'GET'
    );
    const listings = response?.data?.data ?? [];
    if (
      response?.data?.statusCode === 200 &&
      Array.isArray(response.data.data)
    ) {
      useListeStore.getState().setloading(false);
      useListeStore.getState().setList(listings);
    }
    return listings;
  } catch (error) {
    throw error;
  }
}
