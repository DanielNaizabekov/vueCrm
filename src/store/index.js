import Vue from 'vue';
import Vuex from 'vuex';
import requester from './requester';
import auth from './modules/auth';
import profile from './modules/profile';

Vue.use(Vuex);

export default new Vuex.Store({
  actions: requester,
  modules: {
    auth,
    profile,
  },
})