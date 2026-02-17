import { Request } from '@/utils/request';

export async function getHostBookings(params?: Record<string, unknown>) {
  return Request('/booking/host-bookings', 'GET', params);
}
