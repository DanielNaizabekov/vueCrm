/* eslint-disable no-unused-vars */
import { UPLOAD_MEDIA } from '@/consts';
import urls from '@/api/urls';

const actions = {
  [UPLOAD_MEDIA]({ dispatch }, { path, file }) {
    const userId = JSON.parse( localStorage.getItem('currentUserId') );
    const formData = new FormData();
    formData.append('file', file)
    
    return fetch(`${urls[UPLOAD_MEDIA]}${path}/${userId}/${file.name}`, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json());
  },
};

export default {
  actions,
}