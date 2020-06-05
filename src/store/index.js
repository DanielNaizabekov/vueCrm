import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import requester from './requester';

Vue.use(Vuex);

export default new Vuex.Store({
  actions: requester,
  modules: {
    auth,
  },
})