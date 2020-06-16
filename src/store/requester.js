/* eslint-disable no-useless-catch */
import { HTTP_POST_AUTH, HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE } from '../consts';
import axios, { axiosAuth, firebaseConfig } from '../api';
import urls from '../api/urls';

function wrapUrl(method, params) {
  let url = urls[method];

  if(!params) return url;

  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}:`, params[key]);
  });
  
  return encodeURI(url)
}

const actions = {
  async [HTTP_POST_AUTH]({ commit }, { method, body, mutation }) {
    const params = {
      apiKey: firebaseConfig.apiKey,
    };

    try {
      let { data } = await axiosAuth.post(wrapUrl(method, params), body || {});
      mutation = mutation || mutation === false ? mutation : method;
      mutation && commit(mutation, data);
      return data;
    } catch (e) {
      throw e;
    }
  },
  async [HTTP_GET]({ commit }, { method, params = {}, mutation }) {
    params.userId = JSON.parse( localStorage.getItem('currentUserId') );

    try {
      let { data } = await axios.get(wrapUrl(method, params));
      mutation = mutation || mutation === false ? mutation : method;
      mutation && commit(mutation, data);
      return data;
    } catch (e) {
      throw e;
    }
  },
  async [HTTP_POST]({ commit }, { method, params = {}, body, mutation }) {
    params.userId = JSON.parse( localStorage.getItem('currentUserId') );

    try {
      let { data } = await axios.post(wrapUrl(method, params), body || {});
      mutation = mutation || mutation === false ? mutation : method;
      mutation && commit(mutation, data);
      return data;
    } catch(e) {
      throw e;
    }
  },
  async [HTTP_PUT]({ commit }, { method, params = {}, body, mutation }) {
    params.userId = JSON.parse( localStorage.getItem('currentUserId') );

    try {
      let { data } = await axios.put(wrapUrl(method, params), body || {});
      mutation = mutation || mutation === false ? mutation : method;
      mutation && commit(mutation, data);
      return data;
    } catch(e) {
      throw e;
    }
  },
  async [HTTP_DELETE]({ commit }, { method, params = {}, mutation }) {
    params.userId = JSON.parse( localStorage.getItem('currentUserId') );

    try {
      let { data } = await axios.delete(wrapUrl(method, params));
      mutation = mutation || mutation === false ? mutation : method;
      mutation && commit(mutation, data);
      return data;
    } catch(e) {
      throw e;
    }
  },
};

export default actions