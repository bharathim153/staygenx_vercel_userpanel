// services/create-listing.ts

import { useListingStore } from '@/app/components/ui/create-listings/store';
import APICONSTANT from '@/utils/apiconstant';
import { ApiResponse } from '@/utils/apiresponse';
import { Request } from '@/utils/request';

export interface CreateListingApiData {
  userId?: string | number;
  listingId?: string | number;
}

type CreateListingCallback<T> = (response: ApiResponse<T>) => void;

export async function CreateListingApi<T>(
  param: {
    data: CreateListingApiData;
    step?: number;
    isEdit?: boolean;
    editdata?: Record<string, string | number>;
    arraydata?: {
      [key: string]:
        | Record<string, string[] | number[]>
        | string
        | boolean
        | string[]
        | number[];
    };
  },
  callback: CreateListingCallback<T>
): Promise<ApiResponse> {
  try {
    let key = APICONSTANT.createlisting[param?.step ?? 0];
    key = key.replace(/-/g, '');
    let rawData;
    const uploadimage = useListingStore.getState().ListingData.uploadimage;
    debugger;
    if (key === 'uploadimage' && !param?.isEdit) {
      const data = useListingStore.getState().ListingData?.images;
      if (
        Array.isArray(uploadimage?.images) &&
        uploadimage.images.every(img => img instanceof File)
      ) {
        const formData = new FormData();

        const files =
          useListingStore.getState().ListingData.uploadimage?.images ?? [];

        files.forEach(file => {
          formData.append('images', file);
        });
        if (data) {
          data.forEach(file => {
            formData.append('existingImages', file);
          });
        }
        rawData = formData;
      } else {
        const formData = new FormData();
        if (data) {
          data.forEach(file => {
            formData.append('existingImages', file);
          });
        }
        rawData = formData;
      }
    } else if (!param?.isEdit) {
      rawData = useListingStore.getState().ListingData[key];
    } else {
      const formData = new FormData();
      if (key === 'uploadimage') {
        if (Array.isArray(param?.arraydata?.array)) {
          param.arraydata?.array.forEach(file => {
            formData.append('existingImages[]', String(file));
          });
        }
        rawData = formData;
      } else {
        rawData = param?.editdata ?? param?.arraydata;
      }
    }

    let url;
    if (param?.data?.userId) {
      url = `${APICONSTANT.createlisting[param?.step ?? 0]}/${param?.data?.userId}`;
    } else {
      url = `listings/${param?.data?.listingId}/${APICONSTANT.createlisting[param?.step ?? 0]}`;
    }

    let body: string | object | FormData | undefined;

    if (rawData instanceof FormData) {
      rawData.append('progressPercentage', String(param?.step ?? ''));
      body = rawData;
    } else if (rawData && typeof rawData === 'object') {
      body = { ...(rawData as object), progressPercentage: param?.step };
    } else {
      body = { progressPercentage: param?.step };
    }
    const response = await Request<unknown>(
      url,
      param?.step === 0 || param?.step === 8 ? 'POST' : 'PUT',
      body
    );
    callback(response?.data as ApiResponse<T>);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}

export async function RoomImageUpload(params: {
  listingId: string;
  roomId: string;
  images: FormData;
}) {
  try {
    const response = await Request<ApiResponse<[]>>(
      `listings/${params?.listingId}/photo-tour/${params?.roomId}/${APICONSTANT.addphoto}`,
      'PUT',
      params?.images
    );

    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function DeleteListing(listingId: string) {
  try {
    const response = await Request<ApiResponse<[]>>(
      `${APICONSTANT.deleteListing}/${listingId}`,
      'DELETE'
    );

    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}
