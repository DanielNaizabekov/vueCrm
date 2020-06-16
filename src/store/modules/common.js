/* eslint-disable no-unused-vars */
import { UPLOAD_MEDIA, DELETE_MEDIA } from '@/consts';
import urls from '@/api/urls';
import axios from 'axios';

const state = {
  uploadProgress: 0,
};

const getters = {
  getUploadProgress: s => s.uploadProgress,
};

const actions = {
  [UPLOAD_MEDIA]({ commit }, { path, file }) {
    const formData = new FormData();
    formData.append('file', file)
    
    return axios.post(urls[UPLOAD_MEDIA] + path, formData, {
      onUploadProgress: progressEvent => commit(UPLOAD_MEDIA, progressEvent),
    });
  },
  [DELETE_MEDIA]({ dispatch }, { path }) {
    return axios.delete(urls[UPLOAD_MEDIA] + path);
  },
};

const mutations = {
  [UPLOAD_MEDIA](state, data) {
    if( typeof data !== 'object' ) return state.uploadProgress = 0;
    let percent = Math.round( (data.loaded * 100) / data.total );
    state.uploadProgress = +percent || 0;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
}