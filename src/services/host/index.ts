import {
  BlockdateRequestPayload,
  BlockedDate,
  useBlockdatesStore,
} from '@/app/components/ui/hosting/store/blockdates';
import APICONSTANT from '@/utils/apiconstant';
import { ApiResponse } from '@/utils/apiresponse';
import { Request } from '@/utils/request';

export async function BlockDatesApi(
  data: { body: BlockdateRequestPayload },
  callback: (response: ApiResponse) => void
): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.blockDates,
      'POST',
      data.body
    );
    callback(response as ApiResponse);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}

export async function UnBlockDatesApi(
  data: { body: BlockdateRequestPayload },
  callback: (response: ApiResponse) => void
): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.unblockDates,
      'POST',
      data.body
    );
    callback(response as ApiResponse);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}

export async function BlockedDateData(id: string): Promise<BlockedDate[]> {
  try {
    useBlockdatesStore.getState().setloading(true);
    const response = await Request<ApiResponse<BlockedDate[]>>(
      `${APICONSTANT.blockDatesdata}/${id}`,
      'GET'
    );
    const Blockdates = response?.data?.data ?? [];
    if (
      response?.data?.statusCode === 200 &&
      Array.isArray(response.data.data)
    ) {
      useBlockdatesStore.getState().setloading(false);
      useBlockdatesStore.getState().setBlockDatesData(Blockdates);
    }
    return Blockdates;
  } catch (error) {
    throw error;
  }
}
