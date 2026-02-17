import { useDialogStore } from '@/lib/store/dialog-store';
import {
  ChangePassword,
  ChangePasswordApi,
  LoginApi,
  SendResetLinkApi,
  SendOTP,
  SignupApi,
  UserExists,
  ResetPasswordApi,
  VerifyOtpApi,
} from '@/services/auth';
import { ApiResponse } from '@/utils/apiresponse';
import { setCookie } from '@/utils/helper';
import { create } from 'zustand';
import { AuthResponse } from './type';
import { useGlobalStore } from '@/lib/store/global-store';
import { useProfileStore } from './user';

// Define request & response types
type Payload = {
  body: {
    email?: string;
    phone?: string;
    phoneCode?: string;
    password?: string;
    verifyBy?: string;
  };
};

type Response = {
  success: boolean;
  data?: unknown;
};

interface AuthState {
  user: Record<string, unknown> | null;
  setUser: (user: Record<string, unknown>) => void;

  Login: (data: Payload) => Promise<ApiResponse<AuthResponse>>;
  LoginData: Response | null;

  Signup: (data: Payload) => Promise<ApiResponse<AuthResponse>>;
  SignupData: Response | null;

  existsData: Response | null;
  Exists: (data: Payload) => Promise<ApiResponse>;
  clearExistsData: () => void;

  SendOtpFn: (data: Payload) => Promise<ApiResponse<AuthResponse>>;

  ChangePassword: (data: ChangePassword) => Promise<ApiResponse>;

  SendResetLink: (data: { body: { email: string } }) => Promise<ApiResponse>;

  ResetPassword: (data: {
    body: { token: string; newPassword: string; confirmNewPassword: string };
  }) => Promise<ApiResponse>;

  VerifyOtp: (data: {
    body: {
      email?: string;
      phone?: string;
      phoneCode?: string;
      verifyBy?: string;
      otp?: string;
    };
  }) => Promise<ApiResponse>;

  passwordError: string | null;
}

export const useAuthStore = create<AuthState>(set => ({
  passwordError: null,

  user: null,
  setUser: user => {
    set({ user });
  },

  LoginData: null,
  Login: data => {
    return new Promise((resolve, reject) => {
      set({ passwordError: null });
      LoginApi(data, (res: ApiResponse<AuthResponse>) => {
        try {
          if (res?.data?.statusCode === 200 && res?.data) {
            setCookie('appToken', res?.data?.data?.token, 1);
            setCookie('appUserId', res?.data?.data?.user?._id, 1);
            useGlobalStore.getState().setIsLoggedIn(true);
            // useProfileStore.getState().fetchProfile({ body: { userId: res?.data?.data?.user?._id } })
            useProfileStore.getState().setProfileData({
              ...res?.data?.data?.user,
              userinfo: res?.data?.data?.user?.userinfo
                ? Object.fromEntries(
                    Object.entries(res.data.data.user.userinfo).map(
                      ([k, v]) => [k, v == null ? '' : String(v)]
                    )
                  )
                : null,
            });
            set({ LoginData: res });
            useDialogStore.getState().closeDialog();
            window.location.href = '/';
            resolve(res);
          } else {
            reject(new Error('Login failed'));
            set({ passwordError: res?.data?.message ?? 'Invalid field' });
          }
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  },

  SignupData: null,
  Signup: data => {
    return new Promise((resolve, reject) => {
      SignupApi(data, (res: ApiResponse<AuthResponse>) => {
        try {
          if (res?.success && res?.data) {
            setCookie('appToken', res?.data?.data?.token, 1);
            setCookie('appUserId', res?.data?.data?.user?._id, 1);
            useGlobalStore.getState().setIsLoggedIn(true);
            useProfileStore.getState().setProfileData({
              ...res?.data?.data?.user,
              userinfo: res?.data?.data?.user?.userinfo
                ? Object.fromEntries(
                    Object.entries(res.data.data.user.userinfo).map(
                      ([k, v]) => [k, v == null ? '' : String(v)]
                    )
                  )
                : null,
            });
            set({ SignupData: res });
            useDialogStore.getState().closeDialog();
            set({ existsData: null });
            window.location.href = '/';
            resolve(res);
          } else {
            reject(new Error('Signup failed'));
          }
        } catch (err) {
          set({ SignupData: null });
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  },

  existsData: null,
  Exists: data => {
    return new Promise((resolve, reject) => {
      try {
        UserExists(data, (res: ApiResponse) => {
          set({ existsData: res });
          if (res?.success) {
            resolve(res);
          } else {
            reject(new Error('User exists check failed'));
          }
        });
      } catch (err) {
        set({ existsData: null });
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  },

  clearExistsData: () => {
    set({ existsData: null });
  },

  SendOtpFn: data => {
    return new Promise((resolve, reject) => {
      SendOTP(data, (res: ApiResponse<AuthResponse>) => {
        try {
          if (res?.success && res?.data) {
            resolve(res);
          } else {
            reject(new Error('failed'));
          }
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  },

  ChangePassword: data => {
    return new Promise<ApiResponse>((resolve, reject) => {
      ChangePasswordApi(data, (res: ApiResponse) => {
        set({ passwordError: null });
        try {
          if (res?.data?.statusCode === 200 && res?.data) {
            resolve(res);
          } else {
            set({
              passwordError:
                typeof res?.data?.message === 'string'
                  ? res.data.message
                  : 'Invalid',
            });
            reject(new Error('failed'));
          }
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  },

  SendResetLink: data => {
    return new Promise<ApiResponse>((resolve, reject) => {
      SendResetLinkApi(data, (res: ApiResponse) => {
        set({ passwordError: null });
        try {
          if (res?.data?.statusCode === 200 && res?.data) {
            resolve(res);
          } else {
            set({
              passwordError:
                typeof res?.data?.message === 'string'
                  ? res.data.message
                  : 'Invalid',
            });
            reject(new Error('failed'));
          }
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  },

  ResetPassword: data => {
    return new Promise<ApiResponse>((resolve, reject) => {
      ResetPasswordApi(data, (res: ApiResponse) => {
        set({ passwordError: null });
        try {
          if (res?.data?.statusCode === 200 && res?.data) {
            resolve(res);
          } else {
            set({
              passwordError:
                typeof res?.data?.message === 'string'
                  ? res.data.message
                  : 'Invalid',
            });
            reject(new Error('failed'));
          }
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  },

  VerifyOtp: data => {
    return new Promise<ApiResponse>((resolve, reject) => {
      VerifyOtpApi(data, (res: ApiResponse) => {
        try {
          if (res?.data?.statusCode === 200 && res?.data) {
            resolve(res);
          } else {
            reject(new Error('failed'));
          }
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  },
}));
