import {
  AUTH,
  REGISTER,
  USER_DATA,
  SEND_PASSWORD_RESET_EMAIL,
  CONFIRM_PASSWORD_RESET,
} from '../consts';

export default {
  [AUTH]: 'accounts:signInWithPassword?key=:apiKey:',
  [REGISTER]: 'accounts:signUp?key=:apiKey:',
  [SEND_PASSWORD_RESET_EMAIL]: 'accounts:sendOobCode?key=:apiKey:',
  [CONFIRM_PASSWORD_RESET]: 'accounts:resetPassword?key=:apiKey:',
  [USER_DATA]: 'users/:userId:.json',
};