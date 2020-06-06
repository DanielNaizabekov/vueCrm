import {
  HTTP_POST_AUTH,
  HTTP_POST,
  HTTP_GET,
  AUTH,
  REGISTER,
  SEND_PASSWORD_RESET_EMAIL,
  CONFIRM_PASSWORD_RESET,
  LOGOUT,
  USER_DATA,
} from '../../consts';

const state = {
  // token: null,
  // currentUserId: null,
  userData: {},
};

const getters = {
  // hasToken: s => !!s.token,
  // getCurrentUserId: s => s.currentUserId,
  [USER_DATA]: s => s.userData,
};

const actions = {
  [AUTH]({ dispatch }, { body }) {
    return dispatch(HTTP_POST_AUTH, { method: AUTH, body });
  },
  [REGISTER]({ dispatch }, { body }) {
    const { email, password, name } = body;

    return dispatch(HTTP_POST_AUTH, { method: REGISTER, body: { email, password } })
    .then(() => dispatch(HTTP_POST, {
      method: USER_DATA,
      body: { name },
      mutation: false,
    }));
  },
  [SEND_PASSWORD_RESET_EMAIL]({ dispatch }, { body }) {
    body.requestType = 'PASSWORD_RESET';

    return dispatch(HTTP_POST_AUTH, { method: SEND_PASSWORD_RESET_EMAIL, body, mutation: false })
  },
  [CONFIRM_PASSWORD_RESET]({ dispatch }, { body }) {
    return dispatch(HTTP_POST_AUTH, { method: CONFIRM_PASSWORD_RESET, body, mutation: false })
  },
  [USER_DATA]({ dispatch }) {
    return dispatch(HTTP_GET, { method: USER_DATA });
  },
};

const mutations = {
  [AUTH](state, data) {
    // state.token = data.idToken;
    // state.currentUserId = data.localId;
    localStorage.setItem( 'token', JSON.stringify(data.idToken) );
    localStorage.setItem( 'currentUserId', JSON.stringify(data.localId) );
  },
  [REGISTER](state, data) {
    // state.token = data.idToken;
    // state.currentUserId = data.localId;
    localStorage.setItem( 'token', JSON.stringify(data.idToken) );
    localStorage.setItem( 'currentUserId', JSON.stringify(data.localId) );
  },
  [USER_DATA](state, data) {
    let userData = {};
    data.name
    ? userData = data
    : Object.keys(data).forEach(key => userData = data[key]);
    state.userData = userData;
  },
  [LOGOUT](state) {
    state.token = null;
    state.currentUserId = null;
    localStorage.clear();
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};