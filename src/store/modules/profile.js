import { HTTP_PUT, COUNTRIES, UPDATE_USER_DATA, USER_DATA } from '@/consts';
import urls from '@/api/urls';

const state = {
  countries: [],
};

const getters = {
  [COUNTRIES]: s => s.countries,
};

const actions = {
  async [COUNTRIES]({ commit }, params) {
    try {
      let response = await fetch(urls[COUNTRIES] + params);
      response = await response.json();
      commit( COUNTRIES, response );
    } catch(e) {
      commit(COUNTRIES, []);
      throw(e);
    }
  },
  [UPDATE_USER_DATA]({ dispatch }, { body }) {
    return dispatch(HTTP_PUT, { method: USER_DATA, body, mutation: false })
  },
};

const mutations = {
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