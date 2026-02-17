import { create } from 'zustand';

export interface ProfileInfo {
  [key: string]: string | number | boolean | string[];
}

export type UserInfo = {
  languages: string[];
  visitedPlaces: string[];
  _id: string;
  userId: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  mostUselessSkill: string;
};

export type UserProfileResponse = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  softdel: boolean;
  role: string;
  userinfo: UserInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ApiResponse<T> = {
  message: string;
  status: boolean;
  statusCode: number;
  data: T;
};

interface ProfileInfoStore {
  ProfileInfoData: ProfileInfo;
  setProfileData: (data: ProfileInfo) => void;
}

export const useProfileInfoStore = create<ProfileInfoStore>(set => ({
  ProfileInfoData: {},
  setProfileData: data => set({ ProfileInfoData: data }),
}));
