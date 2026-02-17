import { useListingStore } from '@/app/components/ui/create-listings/store';
import APICONSTANT from '@/utils/apiconstant';
import { ApiResponse } from '@/utils/apiresponse';
import { Request } from '@/utils/request';
type ArrivalGuideBody = {
  checkInTime?: string;
  checkOutTime?: string;
  wifiDetails?: { networkName: string; password: string };
  checkoutInstructions?: string[];
  checkInMethod?: string | null; // <-- allow null
};

export async function ArrivalGuide(data: {
  listingId: string;
  body: ArrivalGuideBody;
}) {
  try {
    const response = await Request<ApiResponse>(
      `listings/${data.listingId}/${APICONSTANT.arrivalguide}`,
      'PUT',
      {
        ...data.body,
        progressPercentage: 0,
      }
    );
    if (response?.data?.statusCode === 200) {
      const guide = response?.data?.data?.arrivalGuide as Partial<{
        checkInTime: string;
        checkOutTime: string;
        checkInMethod: string;
        wifiDetails: {
          networkName: string;
          password: string;
        };
        checkoutInstructions: string[];
      }>;
      if (guide) {
        useListingStore?.getState()?.SetListingData({
          ...useListingStore?.getState().ListingData,
          arrivalguide: {
            checkInTime: guide.checkInTime ?? '',
            checkOutTime: guide.checkOutTime ?? '',
            checkInMethod: guide.checkInMethod ?? '',
            wifiDetails: {
              networkName: guide.wifiDetails?.networkName ?? '',
              password: guide.wifiDetails?.password ?? '',
            },
            checkoutInstructions: guide.checkoutInstructions ?? [],
          },
        });
      }
    }

    return response?.data as ApiResponse;
  } catch (error) {
    throw error;
  }
}
