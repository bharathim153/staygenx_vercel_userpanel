export interface UserInfo {
  // Define this properly when you know the structure
  // Temporarily using unknown to avoid `any`
  [key: string]: unknown;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  password: string;
  isActive: boolean;
  softdel: boolean;
  role: 'user' | 'admin'; // Add more roles as needed
  userinfo: UserInfo | null;
  createdAt: string; // ISO string timestamp
  updatedAt: string;
  __v: number;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
  message: string;
  status: boolean;
  statusCode: number;
}

export interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  phoneCode: string;
  address: string;
  emergencyContact: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  phoneCode: string;
  userinfo: string | null;
}

export interface ICategory {
  _id: string;
  name: string;
}

export interface IPropertyType {
  _id: string;
  name: string;
}

export interface IListing {
  _id: string;
  userId: IUser;
  category: ICategory;
  propertyType: IPropertyType;
  documentVerification: string | null;

  adults: number;
  pets: boolean;
  amenities: string[];
  images: string[];

  title: string;
  description: string;

  bookingMode: 'manual_first_5' | string;
  firstGuestPolicy: 'any_guest' | string;
  houseRules: string[];

  hasSmokeAlarm: boolean;
  hasCarbonMonoxideAlarm: boolean;
  hasFirstAidKit: boolean;
  hasFireExtinguisher: boolean;

  cancellationPolicy: 'flexible' | string;
  status: 'Pending' | 'Active' | 'Rejected' | string;

  softdel: boolean;
  progressPercentage: number;

  photoTour: string[];
  blockedDates: unknown[];

  createdAt: string; // ISO timestamps
  updatedAt: string;

  weekdayBasePrice: number;
  weekendBasePrice: number;
  cleaningFee: number;
  serviceFee: number;
  securityDeposit: number;
}
