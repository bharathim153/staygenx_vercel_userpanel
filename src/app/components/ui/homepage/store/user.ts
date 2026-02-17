import { UpdateProfile, UpdateProfileApi, UserProfile } from '@/services/user';
import { ApiResponse } from '@/utils/apiresponse';
import { create } from 'zustand';

export interface UserProfileType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneCode?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: 'user' | 'admin';
  isActive: boolean;
  softdel: boolean;
  createdAt: string;
  updatedAt: string;
  userinfo: null | Record<string, string>;
}

interface ProfileState {
  profileData: UserProfileType | null;
  fetchProfile: (data: UserProfile) => void;
  setProfileData: (data: UserProfileType) => void;
  UpdateProfile: (data: UpdateProfile) => Promise<ApiResponse<UserProfileType>>;
}

export const useProfileStore = create<ProfileState>(set => ({
  profileData: null,
  setProfileData: (data: UserProfileType) => set({ profileData: data }),

  isLoading: false,
  error: null,

  // Fetch user profile
  fetchProfile: (data: UserProfile) => {
    UserProfile(data, (res: ApiResponse<UserProfileType>) => {
      if (res?.statusCode === 200 && res?.data) {
        set({ profileData: res.data });
      }
    });
  },

  UpdateProfile: (
    data: UpdateProfile
  ): Promise<ApiResponse<UserProfileType>> => {
    return new Promise((resolve, reject) => {
      UpdateProfileApi<UserProfileType>(
        data,
        (res: ApiResponse<UserProfileType>) => {
          if (res?.statusCode === 200 && res?.data) {
            set({ profileData: res.data });
            resolve(res);
          } else {
            reject(new Error(res?.message || 'Failed to update profile'));
          }
        }
      );
    });
  },
}));
