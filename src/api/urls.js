import {
  AUTH,
  REGISTER,
  USER_DATA,
  SEND_PASSWORD_RESET_EMAIL,
  CONFIRM_PASSWORD_RESET,
  COUNTRIES,
  UPLOAD_MEDIA,
  DOWNLOAD_MEDIA,
  CURRENCY_RANG,
  CURRENCY_HISTORY,
  CATEGORIES,
  CHANGE_CATEGORY,
} from '../consts';

export default {
  [AUTH]: 'accounts:signInWithPassword?key=:apiKey:',
  [REGISTER]: 'accounts:signUp?key=:apiKey:',
  [SEND_PASSWORD_RESET_EMAIL]: 'accounts:sendOobCode?key=:apiKey:',
  [CONFIRM_PASSWORD_RESET]: 'accounts:resetPassword?key=:apiKey:',
  [USER_DATA]: 'users/:userId:/profile.json',
  [COUNTRIES]: 'https://restcountries.eu/rest/v2/name/',
  [UPLOAD_MEDIA]: 'https://firebasestorage.googleapis.com/v0/b/vue-crm-bbf27.appspot.com/o?name=',
  [DOWNLOAD_MEDIA]: 'https://firebasestorage.googleapis.com/v0/b/vue-crm-bbf27.appspot.com/o/',
  [CURRENCY_RANG]: 'https://api.exchangeratesapi.io/history?base=RUB&start_at=:start:&end_at=:end:&symbols=:rates:',
  [CURRENCY_HISTORY]: 'https://api.exchangeratesapi.io/:date:?base=RUB&symbols=:rates:',
  [CATEGORIES]: 'users/:userId:/planning.json',
  [CHANGE_CATEGORY]: 'users/:userId:/planning/:id:.json',
};