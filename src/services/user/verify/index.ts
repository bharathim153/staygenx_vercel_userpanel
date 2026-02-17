import APICONSTANT from '@/utils/apiconstant';
import { ApiResponse } from '@/utils/apiresponse';
import { Request } from '@/utils/request';

export async function DocumentVerify(data: {
  body: FormData;
}): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.documentverify,
      'POST',
      data.body
    );
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}
