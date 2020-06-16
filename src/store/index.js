import Vue from 'vue';
import Vuex from 'vuex';
import requester from './requester';
import common from './modules/common';
import auth from './modules/auth';
import profile from './modules/profile';
import currency from './modules/currency';
import planning from './modules/planning';

Vue.use(Vuex);

export default new Vuex.Store({
  actions: requester,
  modules: {
    common,
    auth,
    profile,
    currency,
    planning,
  },
})