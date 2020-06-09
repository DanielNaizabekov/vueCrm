import { HTTP_GET, HTTP_PUT, COUNTRIES, UPDATE_USER_DATA, USER_DATA } from '@/consts';
import urls from '@/api/urls';

const state = {
  userData: {},
  countries: [],
};

const getters = {
  [USER_DATA]: s => s.userData,
  [COUNTRIES]: s => s.countries,
};

const actions = {
  [USER_DATA]({ dispatch }) {
    return dispatch(HTTP_GET, { method: USER_DATA });
  },
  [COUNTRIES]({ commit }, params) {
    return fetch(urls[COUNTRIES] + params)
    .then(response => response.json())
    .then(response => commit(COUNTRIES, response));
  },
  [UPDATE_USER_DATA]({ dispatch }, { body }) {
    return dispatch(HTTP_PUT, { method: USER_DATA, body, mutation: false })
    .then(() => dispatch(USER_DATA));
  },
};

const mutations = {
  [USER_DATA](state, data) {
    let userData = {};
    data.name
    ? userData = data
    : Object.keys(data).forEach(key => userData = data[key]);
    state.userData = userData;
  },
  [COUNTRIES](state, data) {
    state.countries = data.map(item => item.name);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};