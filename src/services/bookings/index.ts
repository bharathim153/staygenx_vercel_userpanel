import {
  EstimationRequestPayload,
  useEstimationStore,
} from '@/app/components/ui/booking/store/estimation';
import APICONSTANT from '@/utils/apiconstant';
import { ApiResponse } from '@/utils/apiresponse';
import { Request } from '@/utils/request';

export interface PerDayRate {
  date: string; // YYYY-MM-DD
  rate: number;
}

export interface BookingPriceBreakdown {
  nights: number;
  checkIn: string; // ISO string
  checkOut: string; // ISO string
  perDayRates: PerDayRate[];

  subtotal: number;
  discount: number;
  cleaningFee: number;
  subtotalAfterDiscount: number;
  guestServiceFee: number;
  total: number;
}

export async function EstimationApi(data: {
  body: EstimationRequestPayload;
}): Promise<BookingPriceBreakdown> {
  try {
    useEstimationStore.getState().setloading(true);

    const response = await Request<ApiResponse<BookingPriceBreakdown>>(
      APICONSTANT.Estimation,
      'GET',
      data.body
    );

    const estimation = response?.data?.data;

    if (response?.data?.statusCode === 200 && estimation) {
      useEstimationStore.getState().setEstimation(estimation);
    }

    useEstimationStore.getState().setloading(false);
    return estimation!;
  } catch (error) {
    useEstimationStore.getState().setloading(false);
    throw error;
  }
}
