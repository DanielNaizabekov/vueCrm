import {
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_DELETE,
  CATEGORIES,
  GET_CATEGORIES,
  CREATE_CATEGORY,
  CHANGE_CATEGORY,
  DELETE_CATEGORY,
} from '@/consts';

const state = {
  categotiesList: [],
};

const getters = {
  [GET_CATEGORIES]: s => s.categotiesList,
};

const actions = {
  [GET_CATEGORIES]({ dispatch }) {
    return dispatch(HTTP_GET, { method: CATEGORIES, mutation: GET_CATEGORIES });
  },
  [CREATE_CATEGORY]({ dispatch }, { body }) {
    return dispatch(HTTP_POST, { method: CATEGORIES, body, mutation: false })
    .then(() => dispatch(GET_CATEGORIES))
  },
  [CHANGE_CATEGORY]({ dispatch }, { params, body }) {
    return dispatch(HTTP_PUT, { method: CHANGE_CATEGORY, params, body, mutation: false })
    .then(() => dispatch(GET_CATEGORIES))
  },
  [DELETE_CATEGORY]({ dispatch }, { params }) {
    return dispatch(HTTP_DELETE, { method: CHANGE_CATEGORY, params, mutation: false })
    .then(() => dispatch(GET_CATEGORIES))
  },
};

const mutations = {
  [GET_CATEGORIES](state, data) {
    state.categotiesList = data
    ? Object.keys(data).map(key => ({ id: key, title: data[key].title, tasks: data[key].tasks || [] }))
    : [];
    console.log(state.categotiesList);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
}