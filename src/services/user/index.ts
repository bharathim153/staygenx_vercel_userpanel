import {
  useProfileInfoStore,
  UserProfileResponse,
} from '@/app/components/ui/homepage/store/profileInfo';
import { PersonalInfoFormData } from '@/app/components/ui/homepage/store/type';
import APICONSTANT from '@/utils/apiconstant';
import { ApiResponse } from '@/utils/apiresponse';
import { Request } from '@/utils/request';

export interface UserProfile {
  body: {
    userId: string;
  };
}

export interface UpdateProfile {
  userId: string;
  body: PersonalInfoFormData;
}
export async function UserProfile<T>(
  data: UserProfile,
  callback: (response: ApiResponse<T>) => void
): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      `${APICONSTANT.userprofile}/${data?.body?.userId}`,
      'GET'
    );
    callback(response?.data as ApiResponse<T>);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}

export async function UpdateProfileApi<T>(
  data: UpdateProfile,
  callback: (response: ApiResponse<T>) => void
): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      `${APICONSTANT.userprofile}/${data?.userId}`,
      'PUT',
      data?.body
    );
    callback(response?.data as ApiResponse<T>);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}

export const ProfileInfoApi = async (data: {
  userId: string;
  body: Record<string, string | File | null> | FormData;
}): Promise<ApiResponse<UserProfileResponse>> => {
  try {
    const response = await Request<ApiResponse<UserProfileResponse>>(
      `${APICONSTANT.profileinfo}/${data.userId}`,
      'PUT',
      data.body
    );

    if (response.data?.statusCode === 200) {
      useProfileInfoStore
        .getState()
        .setProfileData(
          (response.data.data && response.data.data.userinfo) || {}
        );
    }

    return response.data!; // <-- returning only the API payload
  } catch (error) {
    throw error;
  }
};
