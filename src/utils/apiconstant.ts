export default class APICONSTANT {
  static readonly login = 'users/login';
  static readonly signup = 'users/register';
  static readonly exists = 'users/exists';
  static readonly profileinfo = 'users/profileInfo';
  static readonly userprofile = 'users/profile';
  static readonly socialLogin = 'users/socialLogin';
  static readonly sendotp = 'users/sendOtp';
  static readonly changePassword = 'users/changePassword';
  static readonly forgotPassword = 'users/forgotPassword';
  static readonly resetPassword = 'users/resetPassword';
  static readonly verifyOtp = 'users/verifyOtp';
  static readonly category = 'categories';
  static readonly propertytypes = 'property-types';
  static readonly amenities = 'amenities';
  static readonly houserules = 'house-rules';
  static readonly listings = 'listings';
  static readonly listingsBlocks = 'listings/explore-blocks';
  static readonly providers = 'listings/providers';
  static readonly documentverify = 'document-verification';
  static readonly arrivalguide = 'arrival-guide';
  static readonly space = 'photo-tour';
  static readonly addphoto = 'add-photos';
  static readonly deleteListing = 'listings';
  static readonly Estimation = 'booking/estimate';
  static readonly blockDates = 'availability/block-dates';
  static readonly unblockDates = 'availability/unblock-dates';

  static readonly blockDatesdata = 'availability/calendar';
  static readonly initiateBooking = '/payment-gateway/create-payment-intent';
  static readonly reserve = '/booking/reserve';
  static readonly search = 'listings/search';
  static readonly createlisting = [
    'listings/create-initial',
    '',
    'categories',
    'property-type',
    'location',
    'floor-plan',
    '',
    'amenities',
    'upload-image',
    '',
    'description',
    '',
    'booking-mode',
    '',
    'base-price',
    'publish',
    'house-rules',
    'photo-tour/add-room',
  ];
}
