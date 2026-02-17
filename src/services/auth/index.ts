// api/auth.ts
import { AuthResponse } from '@/app/components/ui/homepage/store/type';
import APICONSTANT from '@/utils/apiconstant';
import { ApiResponse } from '@/utils/apiresponse';
import { Request } from '@/utils/request';

// Reusable API response wrapper

// Request types
export interface LoginRequest {
  email?: string;
  password?: string;
  phone?: string;
  phoneCode?: string;
}

export interface SignupRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  phone?: string;
}

export interface UserExistsRequest {
  email?: string;
  phone?: string;
  phoneCode?: string;
}

export interface ChangePassword {
  userId: string;
  body: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
}

// Login API
export async function LoginApi(
  data: { body: LoginRequest },
  callback: (response: ApiResponse<AuthResponse>) => void
): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.login,
      'POST',
      data.body
    );
    callback(response as ApiResponse<AuthResponse>);
    return response as ApiResponse<AuthResponse>;
  } catch (error) {
    throw error;
  }
}

// Signup API
export async function SignupApi(
  data: { body: SignupRequest },
  callback: (response: ApiResponse<AuthResponse>) => void
): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.signup,
      'POST',
      data.body
    );
    callback(response as ApiResponse<AuthResponse>);
    return response as ApiResponse<AuthResponse>;
  } catch (error) {
    throw error;
  }
}

// User Exists API
export async function UserExists(
  data: { body: UserExistsRequest },
  callback: (response: ApiResponse) => void
): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.exists,
      'POST',
      data.body
    );
    callback(response as ApiResponse);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}

//send otp
export async function SendOTP(
  data: { body: SignupRequest },
  callback: (response: ApiResponse<AuthResponse>) => void
): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.sendotp,
      'POST',
      data.body
    );
    callback(response as ApiResponse<AuthResponse>);
    return response as ApiResponse<AuthResponse>;
  } catch (error) {
    throw error;
  }
}

//Changepassword
export async function ChangePasswordApi(
  data: ChangePassword,
  callback: (response: ApiResponse) => void
): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      `${APICONSTANT.changePassword}/${data?.userId}`,
      'PATCH',
      data.body
    );
    callback(response as ApiResponse);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}

// ResetLink
export async function SendResetLinkApi(
  data: { body: { email: string } },
  callback: (response: ApiResponse) => void
): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.forgotPassword,
      'POST',
      data.body
    );
    callback(response as ApiResponse);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}

// ResetPasswordApi
export async function ResetPasswordApi(
  data: {
    body: { token: string; newPassword: string; confirmNewPassword: string };
  },
  callback: (response: ApiResponse) => void
): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.resetPassword,
      'POST',
      data.body
    );
    callback(response as ApiResponse);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}

//VerifyOtpApi

export async function VerifyOtpApi(
  data: {
    body: {
      email?: string;
      phone?: string;
      phoneCode?: string;
      verifyBy?: string;
      otp?: string;
    };
  },
  callback: (response: ApiResponse) => void
): Promise<ApiResponse> {
  try {
    const response = await Request<unknown>(
      APICONSTANT.verifyOtp,
      'POST',
      data.body
    );
    callback(response as ApiResponse);
    return response as ApiResponse;
  } catch (error) {
    throw error;
  }
}
