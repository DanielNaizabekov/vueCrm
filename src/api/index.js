import axios from 'axios';
const baseURL = 'https://vue-crm-bbf27.firebaseio.com/';
const baseURLAuth = 'https://identitytoolkit.googleapis.com/v1';

export const firebaseConfig = {
  apiKey: 'AIzaSyAt58MIWXJynJ37tYizKQ-nPmZCWmskErE',
};

export default axios.create({
  baseURL,
  'Content-Type': 'application/json',
});

export const axiosAuth = axios.create({
  baseURL: baseURLAuth,
  'Content-Type': 'application/json',
});