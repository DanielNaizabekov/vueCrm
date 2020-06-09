import {
  AUTH,
  REGISTER,
  USER_DATA,
  SEND_PASSWORD_RESET_EMAIL,
  CONFIRM_PASSWORD_RESET,
  COUNTRIES,
  UPLOAD_MEDIA,
  DOWNLOAD_MEDIA,
} from '../consts';

export default {
  [AUTH]: 'accounts:signInWithPassword?key=:apiKey:',
  [REGISTER]: 'accounts:signUp?key=:apiKey:',
  [SEND_PASSWORD_RESET_EMAIL]: 'accounts:sendOobCode?key=:apiKey:',
  [CONFIRM_PASSWORD_RESET]: 'accounts:resetPassword?key=:apiKey:',
  [USER_DATA]: 'users/:userId:.json',
  [COUNTRIES]: 'https://restcountries.eu/rest/v2/name/',
  [UPLOAD_MEDIA]: 'https://firebasestorage.googleapis.com/v0/b/vue-crm-bbf27.appspot.com/o?name=',
  [DOWNLOAD_MEDIA]: 'https://firebasestorage.googleapis.com/v0/b/vue-crm-bbf27.appspot.com/o/',
};