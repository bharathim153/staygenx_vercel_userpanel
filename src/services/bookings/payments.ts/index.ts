import APICONSTANT from '@/utils/apiconstant';
import { Request } from '@/utils/request';

interface PaymentData {
  body: Record<string, unknown>;
}

type Callback<T = unknown> = (response: T) => void;

export async function initiatePayment(data: PaymentData, callback: Callback) {
  try {
    const response = await Request(
      `${APICONSTANT.initiateBooking}`,
      'POST',
      data?.body
    );
    callback(response);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function Reserve(data: PaymentData, callback: Callback) {
  try {
    const response = await Request(
      `${APICONSTANT.reserve}`,
      'POST',
      data?.body
    );
    callback(response);
    return response;
  } catch (error) {
    throw error;
  }
}
