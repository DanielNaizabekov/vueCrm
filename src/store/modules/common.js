/* eslint-disable no-unused-vars */
import { UPLOAD_MEDIA, DELETE_MEDIA } from '@/consts';
import urls from '@/api/urls';

const actions = {
  [UPLOAD_MEDIA]({ dispatch }, { path, file }) {
    const formData = new FormData();
    formData.append('file', file)
    
    return fetch(urls[UPLOAD_MEDIA] + path, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json());
  },
  [DELETE_MEDIA]({ dispatch }, { path }) {
    return fetch(urls[UPLOAD_MEDIA] + path, {
      method: 'DELETE',
    });
  },
};

export default {
  actions,
}