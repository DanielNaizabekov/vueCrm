import {
  AUTH,
  REGISTER,
  USER_DATA,
  SEND_PASSWORD_RESET_EMAIL,
  CONFIRM_PASSWORD_RESET,
  COUNTRIES,
} from '../consts';

export default {
  [AUTH]: 'accounts:signInWithPassword?key=:apiKey:',
  [REGISTER]: 'accounts:signUp?key=:apiKey:',
  [SEND_PASSWORD_RESET_EMAIL]: 'accounts:sendOobCode?key=:apiKey:',
  [CONFIRM_PASSWORD_RESET]: 'accounts:resetPassword?key=:apiKey:',
  [USER_DATA]: 'users/:userId:.json',
  [COUNTRIES]: 'https://restcountries.eu/rest/v2/name/',
};