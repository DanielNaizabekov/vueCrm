import axios from 'axios';
const baseURLAuth = 'https://identitytoolkit.googleapis.com/v1';
const baseURL = 'https://vue-crm-bbf27.firebaseio.com/';

export const firebaseConfig = {
  apiKey: 'AIzaSyAt58MIWXJynJ37tYizKQ-nPmZCWmskErE',
};

export const axiosAuth = axios.create({
  baseURL: baseURLAuth,
  'Content-Type': 'application/json',
});

export default axios.create({
  baseURL,
  'Content-Type': 'application/json',
});