import { AuthResponse } from '@/app/components/ui/homepage/store/type';
import { useProfileStore } from '@/app/components/ui/homepage/store/user';
import { useGlobalStore } from '@/lib/store/global-store';
import APICONSTANT from '@/utils/apiconstant';
import { ApiResponse } from '@/utils/apiresponse';
import { setCookie } from '@/utils/helper';
import { Request } from '@/utils/request';

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
};
export async function getAccessTokenFromCode(data: {
  authorizationCode: string;
}): Promise<ApiResponse<string | null>> {
  try {
    const body = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET || '',
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL || '',
      grant_type: 'authorization_code',
      code: data.authorizationCode,
    };

    const response: ApiResponse<GoogleTokenResponse> = await Request(
      'https://oauth2.googleapis.com/token',
      'POST',
      body
    );

    if (!response.success || !response.data?.access_token) {
      const failureResponse: ApiResponse<string | null> = {
        success: false,
        statusCode: response.statusCode,
        message: response.message,
        data: null,
      };
      return failureResponse;
    }

    const successResponse: ApiResponse<string> = {
      success: true,
      data: response.data.access_token,
    };
    return successResponse;
  } catch (error) {
    const fail: ApiResponse<string | null> = {
      success: false,
      message: 'Failed to get access token',
      data: null,
    };
    console.error(error);
    return fail;
  }
}

export const socialLogin = async (data: {
  accessToken: string;
  provider: string;
}) => {
  try {
    const res: ApiResponse<AuthResponse> = await Request(
      APICONSTANT.socialLogin,
      'POST',
      data
    );
    if (res?.data?.statusCode === 200) {
      setCookie('appToken', res?.data?.data?.token, 1);
      setCookie('appUserId', res?.data?.data?.user?._id, 1);
      useGlobalStore.getState().setIsLoggedIn(true);
      useProfileStore.getState().setProfileData({
        ...res?.data?.data?.user,
        userinfo: res?.data?.data?.user?.userinfo
          ? Object.fromEntries(
              Object.entries(res.data.data.user.userinfo).map(([k, v]) => [
                k,
                v == null ? '' : String(v),
              ])
            )
          : null,
      });
      window.history.replaceState(null, '', '/');
    }
  } catch (error) {
    console.error(' Error during social login:', error);
  }
};
