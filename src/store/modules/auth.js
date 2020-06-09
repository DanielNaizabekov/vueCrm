import {
  HTTP_POST_AUTH,
  HTTP_POST,
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
};

const getters = {
  // hasToken: s => !!s.token,
  // getCurrentUserId: s => s.currentUserId,
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